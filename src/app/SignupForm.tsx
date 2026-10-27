"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Info, LockKeyhole } from "lucide-react";

type SignupState = { kind: "idle" | "success" | "already" | "error"; message: string };

export default function SignupForm() {
  const [state, setState] = useState<SignupState>({ kind: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setState({ kind: "idle", message: "" });

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          consent: formData.get("consent") === "on",
          website: formData.get("website"),
        }),
      });
      const result = (await response.json()) as { kind?: "success" | "already"; message?: string };
      if (!response.ok) throw new Error(result.message || "We couldn’t save your email. Please try again.");

      setState({ kind: result.kind || "success", message: result.message || "You’re on the list. We’ll be in touch." });
      form.reset();
    } catch (error) {
      setState({
        kind: "error",
        message: error instanceof Error ? error.message : "We couldn’t save your email. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form className="signup" id="signup-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="email">Your email address</label>
        <input id="email" name="email" type="email" placeholder="Your email address" autoComplete="email" maxLength={254} required />
        <button type="submit" disabled={submitting}>
          {submitting ? "Joining…" : "Get updates"} <ArrowRight aria-hidden="true" />
        </button>
        <label className="signup-honeypot" aria-hidden="true">
          Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </form>
      <label className="signup-consent">
        <input type="checkbox" name="consent" form="signup-form" required />
        I agree to receive occasional Chronicle updates by email.
      </label>
      <div className={`signup-feedback ${state.kind}`} role="status" aria-live="polite" aria-atomic="true">
        {state.message && (
          <>
            {state.kind === "success" && <CheckCircle2 aria-hidden="true" />}
            {state.kind === "already" && <Info aria-hidden="true" />}
            {state.kind === "error" && <AlertCircle aria-hidden="true" />}
            <span>{state.message}</span>
          </>
        )}
      </div>
      <p className="signup-note"><LockKeyhole aria-hidden="true" /> Just the occasional note. No noise.</p>
    </>
  );
}
