# VipraTech Applied-AI Engineering

The public VipraTech website is a static site built with Astro; the homepage is a React application. Its fit diagnostic runs entirely in the browser and the contact handoff opens a prefilled email; the site has no backend, API keys, analytics, or lead database.

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

`bun run build` first runs `bun run validate`, which checks every file in `src/content/` and stops the build on any error.

The production artifact is written to `dist/`. To inspect it locally:

```bash
bun run preview
```

## Content

Solution, industry and use-case content is JSON under `src/content/`, in the shapes described in `docs/content/SCHEMA.md`. Edit it there and run `bun run validate`, which checks each file's shape, every cross-reference, each `url`, and the Mermaid diagrams.

- `src/data/order.ts`: display order of solutions and industries.
- `src/data/release.ts`: which industries' use-case pages are built.
- `src/data/proofs.ts`: which proof projects the site may show.

## GitHub Pages

The Pages workflow validates pull requests and pushes to `main`. Only a push to `main` uploads `dist/` and runs the deployment job. Before merging the first deployment commit, configure **Settings → Pages → Build and deployment → Source** as **GitHub Actions**. The existing `vipratech.in` custom-domain setting and DNS remain managed in the repository settings.
