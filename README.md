# Chronicle Official Website

The Coming Soon landing page for Chronicle. It includes a scrollable product-screen showcase and an early-access signup form backed by Brevo.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For local signup integration, create `.env.local` with the server-only values below:

```text
BREVO_API_KEY=your_private_brevo_api_key
BREVO_EARLY_ACCESS_LIST_ID=your_brevo_contact_list_id
```

The API key must have the Contacts permissions required by the signup endpoint. Never use a `NEXT_PUBLIC_` prefix for this key and never commit `.env.local`. See [BREVO_SETUP.md](./BREVO_SETUP.md) for how to find the list ID and configure the key.

## Signup and campaigns

`POST /api/early-access` validates the email and consent, applies a basic rate limit and honeypot check, detects existing list members, then adds new signups to the configured Brevo list. It does **not** send a welcome email. Send announcements to that list from Brevo’s **Email campaigns** area. Signup confirmations tell people to check Spam and mark Chronicle emails as **Not spam** if needed.

The rate limit is held in process memory, so it is best-effort and can reset when the server restarts or scales to multiple instances.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Hosting and repository visibility

This is a full-stack Next.js app: the signup form calls the server route at `/api/early-access`. It needs a host that can run that route; a static export alone will not provide signup functionality.

- **GitHub Pages:** GitHub Pages serves static files and cannot run this Next.js API route. On GitHub Free, the Pages source repository must be public; GitHub Pro, Team, and Enterprise plans also allow private source repositories. Making this repository public by itself will not make the current app work on Pages. See [GitHub Pages availability and limitations](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- **Cloudflare:** Cloudflare Pages is suitable for a static export, but this app’s server route needs a full-stack runtime. Cloudflare Workers can run Next.js through [Cloudflare’s Next.js tooling](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/); review its compatibility guidance before deploying. [Cloudflare Pages custom subdomains](https://developers.cloudflare.com/pages/configuration/custom-domains/) can use a CNAME from an external DNS provider after the hostname is added to the Pages project.
- **Vercel:** Vercel runs Next.js, including the signup route, directly and supports [custom domains](https://vercel.com/docs/domains/set-up-custom-domain). Add `chronicleproject.dpdns.org` to the project, then copy the exact DNS record Vercel provides into DigitalPlat DNS. Vercel’s free [Hobby plan](https://vercel.com/docs/plans/hobby) is limited to personal, non-commercial use; commercial projects require Pro or Enterprise under its current policy.

[DigitalPlat Domains](https://domain.digitalplat.org/) provides the `dpdns.org` name and DNS controls; it does not host this Next.js application. You can keep the GitHub repository private when using a hosting provider that supports private-repository integration. Repository visibility does not replace keeping API keys out of Git.

## Project files

- `src/app/page.tsx` — landing page and product showcase
- `src/app/SignupForm.tsx` — accessible signup UI and feedback
- `src/app/api/early-access/route.ts` — server-side Brevo contact-list integration
- `public/chronicle-*.png` — product screenshots used in the showcase
