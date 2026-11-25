# VipraTech: use-case content schema and writing rules

VipraTech (vipratech.in, VipraTech Labs Private Limited, Kota) sells one thing to one buyer: a claims engine that checks claims, deductions, subsidies and settlements for finance teams at brands, manufacturers and distributors. Distributor scheme claims settlement has run in production every month at a packaged-food brand since mid-2026. Every page leads to the free claims audit or a demo.

Content is JSON, checked by `src/content/schema.ts` (shapes) and `scripts/content-checks.ts` (cross-file rules and diagrams). Run `bun run validate` after every edit.

- `src/content/use-cases/<slug>.json`: one page per workflow (for example damage and expiry claims), written once and shared by every industry.
- `src/content/industries/<slug>.json`: one page per industry, listing the workflows that apply there with a note on how each works in that industry. Add the slug to `INDUSTRY_ORDER` in `src/data/order.ts`.
- `src/data/platform.ts`: the two diagrams on `/platform/`, checked by the same diagram rules.

## Categories

Every use case is in one category (labels and order in `src/data/categories.ts`): `distributor-dealer`, `channel-deductions`, `ledgers-accruals` or `subsidy-freight-quality`. Every category needs at least one use case, and every use case must be listed by at least one industry.

There are no readiness labels. A use case whose `proof_ref` is in `src/data/proofs.ts` shows an "In production" section and is featured; at least one use case must have one.

## Use-case object

```json
{
  "slug": "distributor-scheme-claims",
  "title": "Distributor Scheme Claims Settlement",
  "category": "distributor-dealer",                   // see Categories
  "summary": "Card text, <= 200 chars.",
  "seo": {"title": "<= 60 chars", "description": "<= 155 chars", "keywords": ["4-6 phrases"]},
  "designed_for": ["3-4 job titles of buyers/users"],
  "problem": {"intro": "2-3 sentences", "pain_points": [{"title": "", "detail": "1-2 sentences"}]},   // exactly 4 pain points
  "solution": {"overview": "One paragraph: what the product does and how it behaves.", "capabilities": ["5-6 concrete capabilities"]},
  "workflow": [{"step": 1, "title": "", "detail": "1-2 sentences"}],   // 5-7 steps, numbered from 1, matching flow_diagram
  "flow_diagram": "Mermaid flowchart string (see rules)",
  "architecture": {
    "layers": [{"name": "e.g. Intake", "components": ["2-4 concrete components"]}],   // 4-6 layers
    "diagram": "Mermaid flowchart string with subgraphs (see rules)"
  },
  "app_screens": [{"name": "<= 40 chars", "purpose": "1 sentence", "shows": ["3-4 things on the screen"]}],   // 4-6, in order
  "match_rules": [{"rule": "<= 60 chars", "logic": "1-2 sentences: exactly what is checked"}],         // 4-6, in the order they run
  "exception_codes": [{"code": "UPPER_SNAKE, <= 24 chars", "meaning": "1 sentence", "action": "what the reviewer does"}],   // 4-6, unique
  "data_model": [{"entity": "PascalCase, <= 40 chars", "fields": ["3-6 snake_case fields"]}],      // 3-5
  "inputs": ["3-6 items"],
  "outputs": ["3-6 items"],
  "human_in_the_loop": "1-3 sentences: exactly where finance reviews or approves, and why.",
  "integrations": ["3-6 systems, e.g. 'ERP such as SAP or Tally for credit notes'"],
  "guardrails": ["3-5 concrete controls"],
  "compliance_notes": ["0-3 short, accurate, general tax or audit notes"],
  "rollout": {                                       // shown as "Go-live plan"
    "duration": "e.g. 'Two monthly claim cycles, about 8 weeks'",
    "scope": "1-2 sentences: the first region, claim type or channel, run beside the current process",
    "deliverables": ["3-5 items"],
    "what_we_measure": [{"metric": "", "how": "how it is measured during rollout"}]   // 3-4 metrics, no targets or claimed results
  },
  "faqs": [{"q": "", "a": "2-4 sentences"}],          // exactly 4 buyer questions
  "related": ["1-3 other use-case slugs"],
  "proof_ref": null,                                // or an id from src/content/proof-projects.json, only on the page it proves
  "url": "/use-cases/<slug>/"
}
```

## Industry object

```json
{
  "slug": "pharma-healthcare",
  "name": "Pharma and Healthcare Products",
  "seo": {"title": "<= 60 chars", "description": "<= 155 chars", "keywords": ["4-8 phrases"]},
  "hero": {"headline": "<= 90 chars, the outcome for this industry", "subheadline": "1-2 sentences"},
  "intro": "One paragraph: how this industry sells and where money comes back as claims or deductions.",
  "challenges": [{"title": "", "detail": "1-2 sentences"}],       // exactly 4
  "use_cases": [{"use_case": "damage-and-expiry-claims", "note": "1-2 sentences on how it works in this industry"}],   // 3-12, most important first
  "documents": ["4-8 documents typical of the industry"],
  "systems": ["3-6 systems, portals and data sources the engine reads from"],
  "facts": [{"text": "<= 220 chars, paraphrased", "source": "publisher and date", "url": "https://..."}],   // 0-3, public sources only
  "faqs": [{"q": "", "a": "2-4 sentences"}],                     // 3-4
  "url": "/industries/<slug>/"
}
```

Industry notes must be specific to the industry; the shared detail lives on the use-case page. Proof projects are shown only if their id is in `src/data/proofs.ts`, and only as written in `proof-projects.json` (anonymised).

## Writing rules

1. **No invented numbers.** No results, "x faster", customer counts or volumes we have not processed. Industry facts are allowed only in `facts`, paraphrased from a public source that is linked. Result numbers from the live brand need the brand's written permission first. The sample audit report uses invented figures and says so on the page.
2. **No fake customers, logos, testimonials, certifications or partnerships.**
3. **Expert, never false.** Pages describe each workflow as VipraTech designs and delivers it, in the present tense, with its screens, rules and exception codes. Only a page with an approved proof says it runs at a customer. No page names customers, results or deployments that do not exist.
4. **Security and data statements are commitments.** Change the security page before changing a practice, never after.
5. **Tax notes** stay general and accurate (GST credit notes, TDS and Form 26AS). No section numbers unless certain. Never say "guarantees compliance".
6. **Tone:** plain, specific B2B English for finance readers (British spelling). Active voice, short sentences. Name real documents, roles and systems: claim sheets, scheme circulars, credit notes, DMS, Tally, SAP. No hype words, emoji or exclamation marks.

## Mermaid rules (diagrams are rendered at build time; invalid syntax stops the build)

- `flow_diagram`: starts with `flowchart LR`, 6-10 nodes, at least one decision node `{...}` and a human review node `(...)`.
- `architecture.diagram`: starts with `flowchart TB`, 3-5 `subgraph` blocks matching the layers, 8-14 nodes, with edges between layers.
- Node IDs: short ASCII letters and digits (A, B, C1). Never reuse an ID for a different node. Subgraph IDs differ from node IDs.
- Every label in double quotes: `A["Claim sheet arrives"]`, decision `D{"Rules pass?"}`, human step `R("Finance review")`. Inside labels do not use double quotes, `|`, `[`, `]`, `{`, `}`, `(`, `)`, `<`, `>`, `#`, `;`, `&` or backticks. Keep labels under 40 characters.
- Edge labels: `A -->|"yes"| B`.
- No `classDef`, `style`, `click`, comments or `%%`.
