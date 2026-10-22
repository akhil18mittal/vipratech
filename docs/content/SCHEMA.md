# VipraTech Labs — Industry & Use-Case Content Brief

VipraTech Labs (vipratech.in) is an applied-AI engineering agency based in Kota, India, founded by Akhilesh Mittal (IIT ISM Dhanbad + IMT Ghaziabad; 8 years building a penetration-testing-as-a-service platform for a New Zealand security company, latterly as tech lead of a 10-person team). Positioning line: **"Evidence-first applied-AI engineering."** It builds custom AI systems across five capabilities:

| code | capability slug | name |
|---|---|---|
| DOC | document-intelligence | Document Intelligence |
| CV | computer-vision | Computer Vision |
| VOICE | voice-ai | Voice AI |
| SEC | ai-security | AI Security & Compliance |
| SALES | sales-marketing-automation | AI Sales & Marketing Automation |

Target buyers: Indian mid-market and enterprise (BFSI first), plus global/European companies. Pages are used for SEO **and** by the founder to show a prospect "here is what we can build for your industry".

## Output file

Write ONE JSON file per industry: `raw/<industry-slug>.json` containing:

```json
{ "industry": { ...industry object... }, "use_cases": [ ...exactly the assigned use cases, in the assigned order... ] }
```

Must be valid JSON (UTF-8, double quotes, no trailing commas, no comments). Use the exact slugs, titles and capability codes assigned to you; you may lightly polish a title's wording but never change its slug.

## Industry object

```json
{
  "slug": "insurance",
  "name": "Insurance",
  "seo": {"title": "<= 60 chars, e.g. 'AI for Insurance: Claims, Underwriting & Voice | VipraTech'", "description": "<= 155 chars", "keywords": ["5-8 phrases"]},
  "hero": {"headline": "<= 90 chars, concrete outcome-oriented", "subheadline": "1-2 sentences"},
  "intro": "One paragraph, 80-130 words: where AI genuinely helps this industry today and where it does not.",
  "challenges": [{"title": "", "detail": "1-2 sentences"}],            // exactly 4
  "capability_fit": [{"capability": "document-intelligence", "summary": "1-2 sentences specific to this industry"}],  // one entry per capability that appears in this industry's use cases
  "featured_use_cases": ["slug", "slug", "slug"],                     // 3 of the assigned slugs, the most compelling
  "use_cases": ["all 10 assigned slugs in order"],
  "regulatory_context": [{"name": "e.g. DPDP Act 2023 (India)", "note": "1-2 sentences, general and accurate"}],  // 2-4 entries
  "faqs": [{"q": "", "a": "2-4 sentences"}],                          // exactly 4
  "related_industries": ["slug", "slug", "slug"],                    // from the 20 industry slugs list below
  "cta": {"headline": "", "text": "1-2 sentences inviting a discovery call / pilot"}
}
```

## Use-case object

```json
{
  "slug": "health-claim-document-extraction",
  "industry": "insurance",
  "title": "Health Claim Document Extraction",
  "capability": "document-intelligence",
  "secondary_capabilities": [],                       // 0-2 other capability slugs
  "summary": "Card text, <= 200 chars.",
  "seo": {"title": "<= 60 chars", "description": "<= 155 chars", "keywords": ["4-6 phrases"]},
  "designed_for": ["3-4 job titles of buyers/users"],
  "problem": {"intro": "2-3 sentences", "pain_points": [{"title": "", "detail": "1-2 sentences"}]},   // exactly 4 pain points
  "solution": {"overview": "One paragraph, 70-120 words: what we build and how it behaves.", "capabilities": ["5-6 bullets, each one concrete capability"]},
  "workflow": [{"step": 1, "title": "", "detail": "1-2 sentences"}],          // 5-7 steps, matches flow_diagram
  "flow_diagram": "Mermaid flowchart string (see rules)",
  "architecture": {
    "layers": [{"name": "e.g. Ingestion", "components": ["2-4 concrete components"]}],   // 4-6 layers
    "diagram": "Mermaid flowchart string with subgraphs (see rules)"
  },
  "inputs": ["3-6 items"],
  "outputs": ["3-6 items"],
  "human_in_the_loop": "1-3 sentences: exactly where people review/approve and why.",
  "integrations": ["3-6 typical systems, generic or well-known categories, e.g. 'Core insurance / claims system (via API or SFTP)', 'WhatsApp Business API', 'Salesforce or Zoho CRM'"],
  "guardrails": ["3-5 concrete safety/quality controls"],
  "compliance_notes": ["1-3 short, accurate, general notes; may be empty list"],
  "pilot": {
    "duration": "e.g. '3 weeks'",
    "scope": "1-2 sentences, a realistic narrow pilot",
    "deliverables": ["3-5 items"],
    "what_we_measure": [{"metric": "", "how": "how it is measured during the pilot"}]   // 3-4 metrics, NO numeric targets or claimed results
  },
  "faqs": [{"q": "", "a": "2-4 sentences"}],          // exactly 4, buyer questions (accuracy, data security, languages, integration, cost/timeline, etc.)
  "related": ["3-4 slugs"],                         // prefer same-industry slugs; cross-industry slugs allowed only from the full list provided to you
  "proof_ref": null,                                // or one id from the proof list below, ONLY when the technique strongly overlaps
  "content_type": "use-case"
}
```

## Proof projects (real VipraTech/founder work — reference by id only)

| id | what it is |
|---|---|
| claims-reconciliation-platform | OCR + LLM platform that matches distributor claims spreadsheets against invoices and proofs, applies policy rules, detects duplicates, recalculates amounts, routes uncertain lines to an exception queue, keeps an audit trail; finance keeps final approval. Built for a packaged-food brand. |
| cyra-agentic-pentest | Supervisor-based multi-agent AI pentesting platform: endpoint discovery, attack-surface mapping, OWASP Top 10 and business-logic testing, live vulnerability validation, exploit-chain evidence. Built for a NZ penetration-testing-as-a-service company. |
| autosentinx-voice-red-team | Autonomous red-team and compliance testing for Hindi/Hinglish voice agents: multi-turn adversarial playbooks, PASS/RISK/FAIL evidence mapped to OWASP LLM / Agentic, MITRE ATLAS, NIST AI RMF, RBI, DPDP and TRAI-style requirements. |
| llm-endpoint-security-scanner | Workflow that scans Azure-hosted and custom HTTP LLM endpoints for prompt injection, jailbreaks and data leakage. |
| ai-remediation-pipeline | Pipeline that turns security findings into remediation patches and pull requests for developer review. |
| whatsapp-hotel-booking | WhatsApp Cloud API booking flow for a hotel: availability, room/date/guest selection, rates, UPI/QR payment, confirmation, catalogue of rooms. |
| rera-data-aggregator | Playwright scraper that collects state RERA project listings and full project details into structured Excel output. |

Use `proof_ref` sparingly (roughly 1 in 4 use cases at most, only where it fits). Never claim the proof project was done in the page's industry. Never mention client names.

## Writing rules (strict)

1. **No invented numbers.** No "%" improvements, no "x faster", no market-size stats, no customer counts. `what_we_measure` names metrics and how they're measured, never targets or results.
2. **No fake customers, logos, testimonials, certifications or partnerships.** Do not say "trusted by", "our clients include", "SOC 2 certified", etc.
3. **Honest framing.** These are use cases VipraTech can build, not completed case studies. Use "we build", "the agent does", "a typical pilot". Never "we have deployed this at …".
4. **Regulation:** only well-known regimes, described generally and accurately (e.g. DPDP Act 2023, RBI guidelines on digital lending / outsourcing / recovery agents, RBI FREE-AI framework (2025, a framework of recommendations), IRDAI regulations, SEBI rules on investment advice, TRAI commercial-communication rules, GDPR, EU AI Act, HIPAA for US healthcare, GxP / 21 CFR Part 11, ISO/IEC 42001, OWASP Top 10 for LLM Applications, NIST AI RMF). No clause numbers unless certain. Use "designed to support", "aligned with", "helps you evidence"; never "guarantees compliance".
5. **Medical, legal, financial safety:** never claim diagnosis, legal advice or investment advice. AI assists; qualified humans decide.
6. **Tone:** plain, specific B2B English (British spelling: digitise, organisation, licence). Active voice, short sentences. Name real document types, roles, systems, and workflows from the industry. No hype words: revolutionise, unlock, seamless, cutting-edge, game-changer, leverage, empower, supercharge, robust, delve, harness. No emoji. No exclamation marks.
7. **India + global:** mention Indian specifics where natural (Hindi/Hinglish and regional languages, UPI, GST, Aadhaar-masked KYC, DigiLocker, WhatsApp) but keep pages useful to global buyers.
8. **Unique content per page.** Do not copy paragraphs between use cases. Each page must describe its own documents, steps, risks and FAQs.
9. Aadhaar: say "masked Aadhaar" / "Aadhaar handled per UIDAI rules"; never suggest storing full Aadhaar numbers.

## Mermaid rules (diagrams are rendered on the website; invalid syntax breaks the page)

- `flow_diagram`: starts with `flowchart LR`. 6-10 nodes. Mirrors the workflow steps, including at least one decision node `{...}` for confidence/exception and a human review node.
- `architecture.diagram`: starts with `flowchart TB`. Uses 3-5 `subgraph` blocks matching the architecture layers, 8-14 nodes total, with edges between layers.
- Node IDs: short ASCII letters/digits only (A, B, C1, ING1). Never reuse an ID for a different node.
- **Every node label in double quotes**: `A["Upload claim PDF"]`, decision `D{"Confidence above threshold?"}`, rounded `R("Reviewer")`. Inside labels do NOT use double quotes, `|`, `[`, `]`, `{`, `}`, `(`, `)`, `<`, `>`, `#`, `;` or backticks. Use plain words, commas, hyphens, slashes, `&` is not allowed either — write "and".
- Edge labels: `A -->|"yes"| B` (quoted, same character restrictions).
- Subgraphs: `subgraph S1["Ingestion"]` … `end`. Subgraph IDs distinct from node IDs.
- Separate statements with `\n` (newline) inside the JSON string. No `classDef`, no `style`, no `click`, no comments, no `%%`.
- Keep labels under 40 characters.

Example flow_diagram value (as it appears inside JSON):
`"flowchart LR\n  A[\"Claim file arrives by email or portal\"] --> B[\"Split and classify documents\"]\n  B --> C[\"Extract fields with OCR and LLM\"]\n  C --> D{\"All fields above confidence?\"}\n  D -->|\"yes\"| E[\"Run policy and duplicate checks\"]\n  D -->|\"no\"| F(\"Claims assessor review\")\n  F --> E\n  E --> G[\"Push structured claim to core system\"]"`

## All 20 industry slugs

banking, nbfc-lending, insurance, capital-markets-wealth, fintech-payments, healthcare, pharma-life-sciences, logistics-supply-chain, manufacturing, retail-ecommerce, real-estate-construction, hospitality-travel, education, legal, accounting-audit-consulting, telecom-contact-centers, energy-mining-utilities, automotive-mobility, agriculture, saas-ai-companies

The full list of 200 use-case slugs is in `industries.json` (same folder); only reference slugs that exist there.
