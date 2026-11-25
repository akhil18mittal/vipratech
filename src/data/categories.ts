import type {UseCase} from '../content/schema';

// The groups the use case library and the homepage show, in display order.

export const CATEGORY_ORDER: readonly UseCase['category'][] = [
  'distributor-dealer',
  'channel-deductions',
  'ledgers-accruals',
  'subsidy-freight-quality',
];

export const CATEGORIES: Record<UseCase['category'], {label: string; intro: string}> = {
  'distributor-dealer': {
    label: 'Distributor and dealer claims',
    intro:
      'Schemes, returns, rate differences, displays, expenses, incentives, cash discounts, warranty and loyalty: every claim a distributor or dealer raises, checked against the policy, the invoices and the proof.',
  },
  'channel-deductions': {
    label: 'Retail, quick-commerce and marketplace deductions',
    intro:
      'Short payments, debit notes, fees and penalties from retail chains, quick-commerce platforms, marketplaces and payment partners, tied back to the PO, the invoice, the receipt and the agreed terms.',
  },
  'ledgers-accruals': {
    label: 'Ledgers, credit notes and accruals',
    intro:
      'Approved claims tied to credit notes, ledgers agreed with distributors and principals, rebates recovered and trade spend accruals matched to what is really owed.',
  },
  'subsidy-freight-quality': {
    label: 'Subsidy, freight and quality claims',
    intro:
      'Fertiliser subsidy tied to dispatches, acknowledgements and retail sales, transporter bills checked against contracts, and quality, shortage and transit-loss claims settled on evidence.',
  },
};
