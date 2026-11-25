// Display order of the industry pages. scripts/validate-content.ts checks that this list names every industry file
// exactly once.

export const INDUSTRY_ORDER = [
  'fmcg-packaged-food',
  'd2c-brands',
  'pharma-healthcare',
  'consumer-durables-electronics',
  'building-materials',
  'agri-inputs',
  'auto-components-lubricants',
  'apparel-footwear-lifestyle',
] as const;
