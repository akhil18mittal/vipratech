// Display order for capabilities and industries, as listed in the content pack (docs/content/SCHEMA.md).
// scripts/validate-content.ts checks that these lists name every content file exactly once.

export const CAPABILITY_ORDER = [
  'document-intelligence',
  'computer-vision',
  'voice-ai',
  'ai-security',
  'sales-marketing-automation',
] as const;

export const INDUSTRY_ORDER = [
  'banking',
  'nbfc-lending',
  'insurance',
  'capital-markets-wealth',
  'fintech-payments',
  'healthcare',
  'pharma-life-sciences',
  'logistics-supply-chain',
  'manufacturing',
  'retail-ecommerce',
  'real-estate-construction',
  'hospitality-travel',
  'education',
  'legal',
  'accounting-audit-consulting',
  'telecom-contact-centers',
  'energy-mining-utilities',
  'automotive-mobility',
  'agriculture',
  'saas-ai-companies',
] as const;
