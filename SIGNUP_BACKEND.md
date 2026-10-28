# Early-access signup backend

The landing page is hosted on GitHub Pages. Its API runs separately on Render and stores consenting contacts in Brevo.

## Deploy the API on Render

1. In Render, create a Blueprint from the `chronicleproject/chronicleproject.github.io` repository and select `render.yaml` at the repository root.
2. The Blueprint creates a free Node web service named `chronicle-signup-api` in Singapore. The free service may sleep when idle, so its first request after inactivity can take longer.
3. During setup, enter `BREVO_API_KEY` and `BREVO_EARLY_ACCESS_LIST_ID`. The API key stays in Render's secret environment settings; never put it in GitHub Pages, a `NEXT_PUBLIC_` variable, or source code.
4. Wait for the service's first deploy to become live. Confirm `https://chronicle-signup-api.onrender.com/healthz` returns a successful response. If Render assigns a different `onrender.com` URL, use that exact URL in the next step.

## Connect GitHub Pages to the API

1. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables**.
2. Create the repository variable `CHRONICLE_SIGNUP_API_URL` with the full endpoint URL, for example `https://chronicle-signup-api.onrender.com/api/early-access`.
3. In **Actions**, run **Deploy GitHub Pages** using **Run workflow**. The workflow injects that public endpoint URL while building the static site. The form remains disabled until this value is present in a deployed build.

The API allows requests from `https://chronicleproject.dpdns.org`, `https://chronicleproject.github.io`, and local development at `http://localhost:3000`. It has a health endpoint, validates consent and email format, applies a best-effort in-memory rate limit, checks for existing Brevo list membership, and never returns or logs the submitted email address.

No DNS changes are needed for the API: the form calls Render's HTTPS service URL directly. Keep all Brevo email DNS records unchanged.
