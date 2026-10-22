# VipraTech Applied-AI Engineering

The public VipraTech website is a static site built with Astro; the homepage is a React application. Its fit diagnostic runs entirely in the browser and the contact handoff opens a prefilled email; the site has no backend, API keys, or lead database. Google Analytics 4 (with Google Consent Mode and a cookie banner for EEA, UK and Swiss visitors) is switched on by setting `GA4_ID` and `CONSENT_SCRIPT_SRC` in `src/data/site.ts`.

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

`check:dist` fails while the Calendly placeholder is in use or the privacy policy is unapproved (`CALENDLY_URL` and `PRIVACY_POLICY_APPROVED_ON` in `src/data/site.ts`), so the site can't go live with either.

To inspect the build locally:

```bash
bun run preview
bun run preview:all   # builds every use case, including unreleased ones, marked noindex; local review only
```

The scripts find a local Chrome or Chromium, or use the one in `PUPPETEER_EXECUTABLE_PATH`.

## Content

Solution, industry and use-case content is JSON under `src/content/`, in the shapes described in `docs/content/SCHEMA.md`. Edit it there and run `bun run validate`, which checks each file's shape, every cross-reference, each `url`, and the Mermaid diagrams.

- `src/data/order.ts`: display order of solutions and industries.
- `src/data/release.ts`: which industries' use-case pages are built. To release a batch, review it with `bun run preview:all`, then add its industries with the release date.
- `src/data/proofs.ts`: which proof projects the site may show.

## GitHub Pages

The Pages workflow validates pull requests and pushes to `main`. Only a push to `main` uploads `dist/` and runs the deployment job. Before merging the first deployment commit, configure **Settings → Pages → Build and deployment → Source** as **GitHub Actions**. The existing `vipratech.in` custom-domain setting and DNS remain managed in the repository settings.
