import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';
import {type Content, diagramErrors, findContentErrors, loadContent} from '../scripts/content-checks';
import {categoryLabel, isProofApproved} from '../src/lib/content';

const {content, errors} = loadContent(fileURLToPath(new URL('../src/content/', import.meta.url)));

const errorsAfter = (change: (copy: Content) => void) => {
  const copy = structuredClone(content);
  change(copy);
  return findContentErrors(copy);
};

describe('content', () => {
  it('loads every file against its schema', () => {
    expect(errors).toEqual([]);
    expect([content.useCases.length, content.industries.length, content.proofProjects.length]).toEqual([22, 14, 1]);
  });

  it('passes the cross-file checks', () => {
    expect(findContentErrors(content)).toEqual([]);
  });

  it('shows no readiness labels, and only distributor scheme claims as in production', () => {
    for (const useCase of content.useCases) expect(useCase).not.toHaveProperty('status');
    expect(content.useCases.filter((useCase) => isProofApproved(useCase.proof_ref)).map((useCase) => useCase.slug)).toEqual([
      'distributor-scheme-claims',
    ]);
  });

  it('puts every use case in a category, with the agri, chemicals and freight workflows covered', () => {
    const byCategory = (category: string) =>
      content.useCases
        .filter((useCase) => useCase.category === category)
        .map((useCase) => useCase.slug)
        .sort();
    expect(byCategory('subsidy-freight-quality')).toEqual([
      'fertiliser-subsidy-reconciliation',
      'freight-bill-audit',
      'quality-and-transit-loss-claims',
    ]);
    expect(byCategory('channel-deductions')).toEqual([
      'd2c-payment-and-cod-reconciliation',
      'marketplace-settlement-reconciliation',
      'modern-trade-deductions',
      'quick-commerce-deductions',
    ]);
    expect(byCategory('ledgers-accruals')).toHaveLength(4);
    expect(byCategory('distributor-dealer')).toHaveLength(11);
  });

  it('covers the agri and chemicals industries', () => {
    const slugs = content.industries.map((industry) => industry.slug);
    for (const slug of ['fertilisers', 'crop-protection', 'seeds', 'agri-input-distributors', 'specialty-chemicals', 'chemical-distributors']) {
      expect(slugs).toContain(slug);
    }
  });

  it('reports an industry that lists a missing use case', () => {
    const [first] = content.industries;
    expect(
      errorsAfter((copy) => {
        copy.industries[0].use_cases[0].use_case = 'no-such-use-case';
      }),
    ).toContain(`industry ${first.slug}: use_cases refers to unknown "no-such-use-case"`);
  });

  it('reports a use case that no industry lists', () => {
    expect(
      errorsAfter((copy) => {
        for (const industry of copy.industries) {
          industry.use_cases = industry.use_cases.filter((entry) => entry.use_case !== 'co-marketing-fund-claims');
        }
      }),
    ).toContain('use case co-marketing-fund-claims: no industry lists it');
  });

  it('reports a reference to a missing use case', () => {
    const [first] = content.useCases;
    expect(
      errorsAfter((copy) => {
        copy.useCases[0].related[0] = 'no-such-use-case';
      }),
    ).toContain(`use case ${first.slug}: related refers to unknown "no-such-use-case"`);
  });

  it('reports a url that does not match the page address', () => {
    const [first] = content.useCases;
    expect(
      errorsAfter((copy) => {
        copy.useCases[0].url = '/use-cases/retail/x/';
      }),
    ).toContain(`use case ${first.slug}: url should be /use-cases/${first.slug}/`);
  });

  it('reports a site with nothing in production', () => {
    expect(
      errorsAfter((copy) => {
        for (const useCase of copy.useCases) useCase.proof_ref = null;
      }),
    ).toContain('at least one use case must have an approved proof');
  });

  it('reports a repeated exception code', () => {
    expect(
      errorsAfter((copy) => {
        const [first] = copy.useCases;
        first.exception_codes[1].code = first.exception_codes[0].code;
      }),
    ).toContain(`use case ${content.useCases[0].slug}: exception_codes lists ${content.useCases[0].exception_codes[0].code} more than once`);
  });

  it('reports an empty category', () => {
    expect(
      errorsAfter((copy) => {
        for (const useCase of copy.useCases) if (useCase.category === 'subsidy-freight-quality') useCase.category = 'ledgers-accruals';
      }),
    ).toContain('category subsidy-freight-quality: no use case is in it');
  });
});

describe('isProofApproved', () => {
  it('accepts approved ids only', () => {
    expect(isProofApproved('claims-reconciliation-platform')).toBe(true);
    expect(isProofApproved('no-such-proof')).toBe(false);
    expect(isProofApproved(null)).toBe(false);
  });
});

describe('categoryLabel', () => {
  it('names each category', () => {
    expect(categoryLabel('distributor-dealer')).toBe('Distributor and dealer claims');
    expect(categoryLabel('subsidy-freight-quality')).toBe('Subsidy, freight and quality claims');
  });
});

describe('diagramErrors', () => {
  const flow = [
    'flowchart LR',
    '  A["Claim arrives"] --> B["Extract fields"]',
    '  B --> C{"Confident?"}',
    '  C -->|"yes"| D["Check scheme rules"]',
    '  C -->|"no"| E("Finance review")',
    '  E --> D',
    '  D --> F["Credit note sheet"]',
  ].join('\n');

  it('accepts a diagram that follows the rules', () => {
    expect(diagramErrors(flow, 'LR')).toEqual([]);
  });

  it.each([
    ['styling', `${flow}\n  classDef hot fill:#f00`, 'unsupported syntax'],
    ['a long label', flow.replace('Extract fields', 'Extract every field from every page of the file'), 'longer than 40 characters'],
    ['a forbidden character', flow.replace('Check scheme rules', 'Check scheme & rules'), 'must not use'],
    ['a node without a label', `${flow}\n  F --> G`, 'node G has no label'],
    ['the wrong direction', flow.replace('flowchart LR', 'flowchart TB'), 'first line must be "flowchart LR"'],
  ])('rejects %s', (_, source, message) => {
    expect(diagramErrors(source, 'LR').join('\n')).toContain(message);
  });
});
