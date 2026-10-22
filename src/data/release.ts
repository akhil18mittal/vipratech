// Which use-case pages are built. Solution, industry, hub and library pages are always built; a use-case page is built
// only once its industry is in a batch below, so unreleased use cases are absent from the site and the sitemap.
// To release a batch: review it with `CONTENT_PREVIEW=all`, then add it here with the day it goes live.
// scripts/validate-content.ts checks that each industry exists and appears in at most one batch.

export const USE_CASE_BATCHES: readonly {releasedOn: string; industries: readonly string[]}[] = [
  {releasedOn: '2026-10-22', industries: ['banking', 'nbfc-lending', 'insurance']},
  {releasedOn: '2026-10-22', industries: ['capital-markets-wealth', 'fintech-payments', 'saas-ai-companies']},
  {releasedOn: '2026-10-22', industries: ['healthcare', 'pharma-life-sciences', 'telecom-contact-centers']},
  {releasedOn: '2026-10-22', industries: ['logistics-supply-chain', 'manufacturing', 'retail-ecommerce']},
  {releasedOn: '2026-10-22', industries: ['legal', 'accounting-audit-consulting', 'real-estate-construction']},
];
