# Chronicle Official Website

The Coming Soon landing page for Chronicle, built with Next.js and exported as static files for GitHub Pages. The early-access form is displayed but paused until a signup backend is selected.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

GitHub Pages hosts the static page, while the signup API runs as a separate Render web service and writes signups to Brevo. See [SIGNUP_BACKEND.md](./SIGNUP_BACKEND.md) to deploy and connect the API.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Hosting

GitHub Actions builds the app with `next build` and publishes the generated `out/` directory to GitHub Pages. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The workflow copies the repository root `CNAME` into the published artifact for `chronicleproject.dpdns.org`. Keep its Cloudflare DNS record DNS-only and pointed at `chronicleproject.github.io`; mail-related DNS records are separate and should be left as configured.

## Project files

- `src/app/page.tsx` — landing page and product showcase
- `src/app/SignupForm.tsx` — accessible signup UI and feedback
- `.github/workflows/pages.yml` — GitHub Pages build and deployment
- `signup-api/server.mjs` — Render API and Brevo contact-list integration
- `render.yaml` — Render web-service Blueprint
- `public/chronicle-*.png` — product screenshots used in the showcase
