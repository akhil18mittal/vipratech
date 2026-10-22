# VipraTech Labs: industry and use-case content pack

Website content for vipratech.in: 5 solution (capability) pages, 20 industry pages and 200 use-case pages. Every use case has a process-flow diagram and an architecture diagram in Mermaid.

## What's inside

| Folder | What it is | Use it for |
|---|---|---|
| `preview/index.html` | Offline browser for everything, with diagrams rendered | Review content, or show a prospect on a call. Open it in a browser; diagrams need internet to load the Mermaid library. |
| `content/` | Structured JSON, one file per page, plus `index.json` | Feeding a Next.js / Astro / React site or a headless CMS |
| `markdown/` | The same pages as Markdown with YAML frontmatter, diagrams in ` ```mermaid ` blocks | Static-site generators, WordPress import, or editing by hand |
| `seo/url-map.csv` | Every URL with its SEO title and meta description | Planning, redirects, checking titles in one sheet |
| `seo/sitemap.xml` | Sitemap for all pages on https://vipratech.in | Submit in Google Search Console after the pages are live |
| `schema/SCHEMA.md` | Field-by-field schema and the writing rules used | Adding new industries or use cases in the same format |

## Suggested URL structure

- `/solutions/{capability}/`: 5 pages (document-intelligence, computer-vision, voice-ai, ai-security, sales-marketing-automation)
- `/industries/{industry}/`: 20 pages
- `/use-cases/{industry}/{use-case}/`: 200 pages
- `/use-cases/`: library page with filters by industry and capability (use `content/index.json`)

## Page templates to build (only 3)

1. **Industry page**: hero, intro, 4 challenges, "where AI fits" by capability, 10 use-case cards (3 featured), regulatory context, 4 FAQs, call to action.
2. **Use-case page**: summary, who it's for, problem and 4 pain points, what we build, workflow steps plus flow diagram, architecture layers plus architecture diagram, inputs/outputs, human-in-the-loop, integrations, guardrails, compliance notes, pilot plan (duration, scope, deliverables, what we measure), "built on related work" box when `proof_ref` is set, 4 FAQs, related use cases.
3. **Solution page**: hero, intro, what we build, how we work, related work, use cases grouped by industry, FAQs.

## Rendering the diagrams

Diagrams are Mermaid `flowchart` definitions in `flow_diagram` and `architecture.diagram`. All 400 were checked with the Mermaid 11 parser.

- Client side: load Mermaid (`https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js`) and call `mermaid.render()`, or put the text in `<pre class="mermaid">`.
- Better for SEO and speed: pre-render to SVG at build time with `@mermaid-js/mermaid-cli` (`mmdc -i diagram.mmd -o diagram.svg`) and add the workflow steps as text next to the image. The steps are already in `workflow`, so search engines can read them.

## SEO notes

- Use `seo.title` and `seo.description` for `<title>` and meta description.
- Add `FAQPage` structured data from each page's `faqs`, and `BreadcrumbList` (Home › Industries › Insurance › Use case).
- Link every use case to its industry, its solution page and its `related` use cases. The content already includes these links.
- Publish the industry and solution pages first, then use cases industry by industry, and submit the sitemap. Google's spam policies count large batches of thin pages as "scaled content abuse". These pages are long-form and unique, but read each one before publishing and add your own detail where you can.

## Before you publish: checklist

- [ ] **Proof references.** Pages with `proof_ref` show a "Built on related work" box. `content/proof-projects.json` lists each project's `publish_status`. Get client permission before naming a client or adding numbers.
- [ ] **No invented numbers.** The pages describe what is measured in a pilot, not results. Add real numbers only from real projects.
- [ ] **Regulatory notes** are short and general. Have someone from the sector read the BFSI, healthcare and pharma pages before you publish.
- [ ] **Contact path.** Every page needs a "Book a 20-minute call" button (Calendly) and a WhatsApp link.
- [ ] **Founder credibility** block on industry and solution pages: 8 years building a security platform for a New Zealand company, IIT ISM Dhanbad and IMT Ghaziabad, production agentic AI.

## Using it in sales

When a prospect asks "what can you do for us?", open their industry page (`/industries/{industry}/`), show the 3 featured use cases, then open one use case and walk through its flow and pilot plan. Until the site is live, `preview/index.html` works the same way on a screen share.
