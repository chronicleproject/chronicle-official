# Chronicle Official Website

The Coming Soon landing page for Chronicle, built with Next.js and exported as static files for GitHub Pages. The early-access form is displayed but paused until a signup backend is selected.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The static Pages deployment cannot run a Next.js API route. The signup form remains visible but disabled while a backend is being chosen. `BREVO_SETUP.md` contains notes for the previous Brevo integration and will need updating if that backend is restored.

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
- `public/chronicle-*.png` — product screenshots used in the showcase
