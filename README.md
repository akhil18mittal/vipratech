# VipraTech: distributor claims reconciliation

The public VipraTech website: one product (AI that checks distributor claims and deductions for finance teams at FMCG and D2C brands) and one next step (the free claims audit). It is a static site built with Astro. Pages are plain HTML with no client-side framework; React components render at build time. Audit requests go by email or WhatsApp, so the site has no backend, API keys, form or lead database. Google Analytics 4 (with Google Consent Mode and a cookie banner for EEA, UK and Swiss visitors) is switched on by setting `GA4_ID` in `src/data/site.ts`; the banner is part of the site, so no consent service is needed.

## Local development

Install [Bun](https://bun.sh/) and Node.js 22.23.4 or newer (Astro runs on Node), then run:

```bash
bun install --frozen-lockfile
bun run dev
```

Astro prints the local preview URL.

## Verification

```bash
bun run typecheck
bun run knip
bun run test
bun run build
```

`bun run build` first runs `bun run validate`, which checks every file in `src/content/` and stops the build on any error, then `bun run diagrams`, which renders the Mermaid diagrams to `public/diagrams/` with headless Chrome (only diagrams whose source changed are redrawn).

The production artifact is written to `dist/`. Two checks run on it, in CI too:

```bash
bun run check:dist    # head tags, JSON-LD, links, images, sitemap, and nothing unready published
bun run check:mobile  # nothing runs off the edge at 400px, one page per template
```

`check:dist` fails while the privacy policy is unapproved (`PRIVACY_POLICY_APPROVED_ON` in `src/data/site.ts`), so the site can't go live with a draft policy, and fails if any page links to the Calendly placeholder. While `CALENDLY_URL` is still the placeholder, no "Book a 20-minute call" button is shown; set the real event URL to show them.

To inspect the build locally:

```bash
bun run preview
```

The scripts find a local Chrome or Chromium, or use the one in `PUPPETEER_EXECUTABLE_PATH`.

## Content

Use-case pages are JSON under `src/content/use-cases/`, in the shape described in `docs/content/SCHEMA.md`, each marked `live` or `early-access`. Edit them there and run `bun run validate`, which checks each file's shape, every cross-reference, each `url`, and the Mermaid diagrams.

- `src/pages/index.astro`: the homepage. Its problem and workflow sections come from the live claims use case.
- `src/pages/free-claims-audit.astro`, `sample-audit-report.astro`, `security.astro`: the audit offer, a sample report with invented figures, and data-handling commitments.
- `src/data/site.ts`: contact links (audit, email, WhatsApp, Calendly), the GA4 ID and the privacy policy approval date.
- `src/data/proofs.ts`: which proof projects the site may show.
- `astro.config.mjs`: redirects from retired pages of the old multi-industry site. Every other retired address gets the 404 page.

## GitHub Pages

The Pages workflow validates pull requests and pushes to `main`. Only a push to `main` uploads `dist/` and runs the deployment job. Before merging the first deployment commit, configure **Settings → Pages → Build and deployment → Source** as **GitHub Actions**. The existing `vipratech.in` custom-domain setting and DNS remain managed in the repository settings.
