// Content for the homepage's moving parts: the review queue in the hero, the ticker and the leakage calculator's
// starting values. The queue rows are sample data and the hero labels them so.

export interface QueueRow {
  /** The workflow, shown as [TYPE]. */
  type: string;
  /** What the line is: counterparty, document and amount. */
  text: string;
  /** The decision or exception code. */
  status: string;
  tone: 'held' | 'ok' | 'dispute';
  confidence: string;
}

export const QUEUE_ROWS: readonly QueueRow[] = [
  {type: 'SCHEME', text: 'D-0412 · INV 88213 · ₹18,400', status: 'SCHEME_EXPIRED', tone: 'held', confidence: 'rule R1'},
  {type: 'RETURNS', text: 'D-1188 · batch B23-071 · ₹6,250', status: 'BATCH_NOT_SOLD', tone: 'held', confidence: 'rule R1'},
  {type: 'QUICK-COMM', text: 'PO 55102 · dark store BLR-14 · ₹12,900', status: 'SHORT_NOT_IN_GRN', tone: 'dispute', confidence: 'GRN match'},
  {type: 'SCHEME', text: 'D-0907 · INV 77120 · ₹4,300', status: 'APPROVED', tone: 'ok', confidence: 'conf 0.99'},
  {type: 'DISPLAY', text: 'Outlet 3321 · March · ₹1,500', status: 'PHOTO_REUSED', tone: 'held', confidence: 'image match'},
  {type: 'FREIGHT', text: 'LR 448812 · Kota–Indore · ₹9,800', status: 'RATE_NOT_CONTRACT', tone: 'held', confidence: 'rule R1'},
  {type: 'CASH DISC', text: 'Dealer 5521 · 3 invoices · ₹2,140', status: 'LATE_FOR_SLAB', tone: 'dispute', confidence: 'bank date'},
  {type: 'SUBSIDY', text: 'Dispatch 7781 · DAP · 24 MT', status: 'NOT_ACKNOWLEDGED', tone: 'held', confidence: 'day 9'},
  {type: 'SCHEME', text: 'D-0233 · INV 90114 · ₹7,620', status: 'DUPLICATE_CLAIM', tone: 'held', confidence: 'Feb claim'},
  {type: 'MODERN TRADE', text: 'Chain debit note 6620 · ₹31,000', status: 'MARGIN_ABOVE_TERMS', tone: 'dispute', confidence: 'terms v3'},
];

export const TICKER_ITEMS: readonly string[] = [
  'Every claim line checked, not sampled',
  'DUPLICATE_CLAIM · SCHEME_EXPIRED · QTY_OVER_INVOICE',
  '22 claim and deduction workflows',
  'Finance approves every credit note',
  'Free claims audit in 5 working days',
  'Quick-commerce, modern-trade and marketplace deductions',
  'Fertiliser subsidy, freight and transit-loss claims',
  'Your data is never used to train AI models',
];

/** Starting values for the leakage calculator. The visitor sets every one of them. */
export const CALCULATOR_DEFAULTS = {
  /** Claims and deductions settled per month, in ₹ lakh. */
  monthlyLakh: 50,
  /** The share the visitor thinks is invalid or overpaid, in percent. */
  invalidPct: 2,
  /** Claim lines checked per month. */
  lines: 5000,
  /** Minutes a person spends per line today. */
  minutesPerLine: 2,
} as const;
