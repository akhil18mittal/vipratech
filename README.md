# VipraTech Applied-AI Engineering

The public VipraTech website is a static React application built with Vite. Its fit diagnostic runs entirely in the browser and the contact handoff opens a prefilled email; the site has no backend, API keys, analytics, or lead database.

## Local development

Install [Bun](https://bun.sh/), then run:

```bash
bun install --frozen-lockfile
bun run dev
```

Vite prints the local preview URL.

## Verification

```bash
bun run typecheck
bun run knip
bun run test
bun run build
```

The production artifact is written to `dist/`. To inspect it locally:

```bash
bun run preview
```

## GitHub Pages

The Pages workflow validates pull requests and pushes to `main`. Only a push to `main` uploads `dist/` and runs the deployment job. Before merging the first deployment commit, configure **Settings → Pages → Build and deployment → Source** as **GitHub Actions**. The existing `vipratech.in` custom-domain setting and DNS remain managed in the repository settings.
