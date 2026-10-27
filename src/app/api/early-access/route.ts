import { NextResponse } from "next/server";

const recentRequests = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function isValidEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  if (typeof data.website === "string" && data.website.trim()) {
    return NextResponse.json({ message: "Thanks for your interest." });
  }
  if (data.consent !== true) {
    return NextResponse.json({ message: "Please confirm that you’d like to receive email updates." }, { status: 400 });
  }
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Enter a valid email address and try again." }, { status: 400 });
  }

  const now = Date.now();
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientKey = forwardedFor || "unknown";
  const requests = (recentRequests.get(clientKey) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (requests.length >= MAX_REQUESTS) {
    return NextResponse.json({ message: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  }
  requests.push(now);
  recentRequests.set(clientKey, requests);

  const apiKey = process.env.BREVO_API_KEY;
  const listIdValue = process.env.BREVO_EARLY_ACCESS_LIST_ID;
  const listId = listIdValue ? Number(listIdValue) : NaN;
  if (!apiKey || !Number.isSafeInteger(listId) || listId < 1) {
    return NextResponse.json(
      { message: "The signup form is ready, but email registration is not connected yet. Please check back soon." },
      { status: 503 },
    );
  }

  try {
    const contactResponse = await fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}?identifierType=email_id`,
      {
        headers: { "api-key": apiKey, Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      },
    );

    let isAlreadyEnrolled = false;
    if (contactResponse.ok) {
      const contact = (await contactResponse.json()) as { listIds?: number[] };
      isAlreadyEnrolled = contact.listIds?.includes(listId) ?? false;
    } else if (contactResponse.status !== 404) {
      console.error("Brevo early-access lookup failed", { status: contactResponse.status });
      return NextResponse.json({ message: "Signup is temporarily unavailable. Please try again shortly." }, { status: 502 });
    }

    if (isAlreadyEnrolled) {
      return NextResponse.json({
        kind: "already",
        message: "You’re already on the early-access list. Check your inbox and Spam folder for Chronicle emails; if one lands in Spam, mark it as Not spam.",
      });
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
      return NextResponse.json({
        kind: "success",
        message: "You’re on the list. Check your inbox and Spam folder for Chronicle emails; if one lands in Spam, mark it as Not spam.",
      });
    }

    if (brevoResponse.status === 400 || brevoResponse.status === 401 || brevoResponse.status === 403 || brevoResponse.status === 404) {
      console.error("Brevo early-access signup rejected", { status: brevoResponse.status });
      return NextResponse.json({ message: "We couldn’t add your email right now. Please try again later." }, { status: 502 });
    }
    console.error("Brevo early-access signup failed", { status: brevoResponse.status });
    return NextResponse.json({ message: "Signup is temporarily unavailable. Please try again shortly." }, { status: 502 });
  } catch {
    console.error("Brevo early-access signup request failed");
    return NextResponse.json({ message: "Signup is temporarily unavailable. Please try again shortly." }, { status: 502 });
  }
}
