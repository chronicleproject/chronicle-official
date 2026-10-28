import { ArrowRight, LockKeyhole } from "lucide-react";

export default function SignupForm() {
  return (
    <>
      <form className="signup" id="signup-form">
        <label className="sr-only" htmlFor="email">Your email address</label>
        <input id="email" name="email" type="email" placeholder="Your email address" autoComplete="email" maxLength={254} disabled />
        <button type="submit" disabled>
          Get updates <ArrowRight aria-hidden="true" />
        </button>
      </form>
      <label className="signup-consent">
        <input type="checkbox" name="consent" form="signup-form" disabled />
        I agree to receive occasional Chronicle updates by email.
      </label>
      <p className="signup-note"><LockKeyhole aria-hidden="true" /> Early access signups will open soon.</p>
    </>
  );
}
