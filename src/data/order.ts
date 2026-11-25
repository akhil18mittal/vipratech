// Display order of the industry pages. scripts/validate-content.ts checks that this list names every industry file
// exactly once.

export const INDUSTRY_ORDER = [
  'fmcg-packaged-food',
  'beauty-personal-care',
  'd2c-brands',
  'pharma-healthcare',
  'consumer-durables-electronics',
  'fertilisers',
  'crop-protection',
  'seeds',
  'agri-input-distributors',
  'specialty-chemicals',
  'chemical-distributors',
  'building-materials',
  'auto-components-lubricants',
  'apparel-footwear-lifestyle',
] as const;
