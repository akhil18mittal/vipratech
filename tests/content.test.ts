import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';
import {type Content, diagramErrors, findContentErrors, loadContent} from '../scripts/content-checks';
import {isProofApproved, statusLabel} from '../src/lib/content';

const {content, errors} = loadContent(fileURLToPath(new URL('../src/content/', import.meta.url)));

const errorsAfter = (change: (copy: Content) => void) => {
  const copy = structuredClone(content);
  change(copy);
  return findContentErrors(copy);
};

describe('content', () => {
  it('loads every file against its schema', () => {
    expect(errors).toEqual([]);
    expect([content.useCases.length, content.proofProjects.length]).toEqual([3, 1]);
  });

  it('passes the cross-file checks', () => {
    expect(findContentErrors(content)).toEqual([]);
  });

  it('has the claims settlement page live and the rest in early access', () => {
    const status = Object.fromEntries(content.useCases.map((useCase) => [useCase.slug, useCase.status]));
    expect(status).toEqual({
      'credit-note-reconciliation': 'early-access',
      'distributor-scheme-claims': 'live',
      'quick-commerce-deductions': 'early-access',
    });
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

  it('reports a site with nothing live', () => {
    expect(
      errorsAfter((copy) => {
        for (const useCase of copy.useCases) useCase.status = 'early-access';
      }),
    ).toContain('at least one use case must be live');
  });
});

describe('isProofApproved', () => {
  it('accepts approved ids only', () => {
    expect(isProofApproved('claims-reconciliation-platform')).toBe(true);
    expect(isProofApproved('no-such-proof')).toBe(false);
    expect(isProofApproved(null)).toBe(false);
  });
});

describe('statusLabel', () => {
  it('names each status', () => {
    expect([statusLabel('live'), statusLabel('early-access')]).toEqual(['Live', 'Early access']);
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
