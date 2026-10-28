import { createServer } from "node:http";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 16 * 1024;
const recentRequests = new Map();
const listId = Number(process.env.BREVO_EARLY_ACCESS_LIST_ID);
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || "https://chronicleproject.dpdns.org,https://chronicleproject.github.io,http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(body));
}

function applyCors(request, response) {
  const origin = request.headers.origin;
  response.setHeader("Vary", "Origin");

  if (!origin) return true;
  if (!allowedOrigins.has(origin)) return false;

  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Max-Age", "600");
  return true;
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large.");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function validEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkRateLimit(request) {
  const forwarded = request.headers["x-forwarded-for"];
  const forwardedIps = typeof forwarded === "string" ? forwarded.split(",").map((ip) => ip.trim()) : [];
  const clientIp = request.headers["x-real-ip"] || forwardedIps.at(-1) || "unknown";
  const now = Date.now();
  if (recentRequests.size > 10_000) {
    for (const [ip, timestamps] of recentRequests) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) recentRequests.delete(ip);
    }
  }
  const requests = (recentRequests.get(clientIp) || []).filter((timestamp) => now - timestamp < WINDOW_MS);

  if (requests.length >= MAX_REQUESTS) return false;
  requests.push(now);
  recentRequests.set(clientIp, requests);
  return true;
}

async function enrollContact(email) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || !Number.isSafeInteger(listId) || listId < 1) {
    return { status: 503, body: { message: "Signup is not connected yet. Please check back soon." } };
  }

  const contactResponse = await fetch(
    `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}?identifierType=email_id`,
    {
      headers: { "api-key": apiKey, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    },
  );

  if (contactResponse.ok) {
    const contact = await contactResponse.json();
    if (contact.listIds?.includes(listId)) {
      return {
        status: 200,
        body: {
          kind: "already",
          message: "You’re already on the list. Check your inbox and Spam folder for Chronicle emails.",
        },
      };
    }
  } else if (contactResponse.status !== 404) {
    console.error("Brevo contact lookup failed", { status: contactResponse.status });
    return { status: 502, body: { message: "Signup is temporarily unavailable. Please try again shortly." } };
  }

  const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (brevoResponse.ok) {
    return {
      status: 200,
      body: {
        kind: "success",
        message: "You’re on the list. Check your inbox and Spam folder for Chronicle emails.",
      },
    };
  }

  console.error("Brevo contact signup failed", { status: brevoResponse.status });
  return { status: 502, body: { message: "Signup is temporarily unavailable. Please try again shortly." } };
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", "http://localhost");

  if (url.pathname === "/healthz" && request.method === "GET") {
    response.writeHead(204, { "Cache-Control": "no-store" });
    response.end();
    return;
  }

  if (url.pathname !== "/api/early-access") {
    sendJson(response, 404, { message: "Not found." });
    return;
  }

  if (!applyCors(request, response)) {
    sendJson(response, 403, { message: "This website is not allowed to submit signups." });
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    sendJson(response, 405, { message: "Method not allowed." });
    return;
  }

  let data;
  try {
    data = await readJson(request);
  } catch (error) {
    const status = error?.status || 400;
    sendJson(response, status, { message: status === 413 ? error.message : "Please enter a valid email address." });
    return;
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    sendJson(response, 400, { message: "Please enter a valid email address." });
    return;
  }
  if (typeof data.website === "string" && data.website.trim()) {
    sendJson(response, 200, { kind: "success", message: "Thanks for your interest." });
    return;
  }
  if (data.consent !== true) {
    sendJson(response, 400, { message: "Please confirm that you’d like to receive email updates." });
    return;
  }

  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  if (!validEmail(email)) {
    sendJson(response, 400, { message: "Enter a valid email address and try again." });
    return;
  }
  if (!checkRateLimit(request)) {
    sendJson(response, 429, { message: "Too many attempts. Please wait a few minutes and try again." });
    return;
  }

  try {
    const result = await enrollContact(email);
    sendJson(response, result.status, result.body);
  } catch {
    console.error("Brevo early-access request failed");
    sendJson(response, 502, { message: "Signup is temporarily unavailable. Please try again shortly." });
  }
});

const port = Number(process.env.PORT) || 10000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Chronicle signup API listening on port ${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
