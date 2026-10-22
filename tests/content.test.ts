import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';
import {type Content, diagramErrors, findContentErrors, loadContent} from '../scripts/content-checks';
import {isProofApproved, linkFor} from '../src/lib/content';

const {content, errors} = loadContent(fileURLToPath(new URL('../src/content/', import.meta.url)));

const errorsAfter = (change: (copy: Content) => void) => {
  const copy = structuredClone(content);
  change(copy);
  return findContentErrors(copy);
};

describe('content pack', () => {
  it('loads every file against its schema', () => {
    expect(errors).toEqual([]);
    expect([content.capabilities.length, content.industries.length, content.useCases.length, content.proofProjects.length]).toEqual([5, 20, 200, 7]);
  });

  it('passes the cross-file checks', () => {
    expect(findContentErrors(content)).toEqual([]);
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
    const [first] = content.industries;
    expect(
      errorsAfter((copy) => {
        copy.industries[0].url = '/industry/';
      }),
    ).toContain(`industry ${first.slug}: url should be /industries/${first.slug}/`);
  });

  it('reports capability lists that no longer match the use cases', () => {
    const found = errorsAfter((copy) => {
      copy.useCases.find((useCase) => useCase.capability === 'voice-ai')!.capability = 'computer-vision';
    });
    expect(found.some((error) => error.startsWith('capability voice-ai: use_cases is out of date'))).toBe(true);
    expect(found.some((error) => error.startsWith('capability computer-vision: use_cases is out of date'))).toBe(true);
  });
});

describe('linkFor', () => {
  it('links every solution and industry page', () => {
    for (const item of [...content.capabilities, ...content.industries]) expect(linkFor(item)).toBe(item.url);
  });

  it('links use cases only in released industries', () => {
    const banking = content.useCases.find((useCase) => useCase.industry === 'banking')!;
    const legal = content.useCases.find((useCase) => useCase.industry === 'legal')!;
    expect(linkFor(banking)).toBe(banking.url);
    expect(linkFor(legal)).toBeUndefined();
  });
});

describe('isProofApproved', () => {
  it('accepts approved ids only', () => {
    expect(isProofApproved('claims-reconciliation-platform')).toBe(true);
    expect(isProofApproved('no-such-proof')).toBe(false);
    expect(isProofApproved(null)).toBe(false);
  });
});

describe('diagramErrors', () => {
  const flow = [
    'flowchart LR',
    '  A["Claim arrives"] --> B["Extract fields"]',
    '  B --> C{"Confident?"}',
    '  C -->|"yes"| D["Check policy"]',
    '  C -->|"no"| E("Assessor review")',
    '  E --> D',
    '  D --> F["Push to core system"]',
  ].join('\n');

  it('accepts a diagram that follows the rules', () => {
    expect(diagramErrors(flow, 'LR')).toEqual([]);
  });

  it.each([
    ['styling', `${flow}\n  classDef hot fill:#f00`, 'unsupported syntax'],
    ['a long label', flow.replace('Extract fields', 'Extract every field from every page of the file'), 'longer than 40 characters'],
    ['a forbidden character', flow.replace('Check policy', 'Check policy & rules'), 'must not use'],
    ['a node without a label', `${flow}\n  F --> G`, 'node G has no label'],
    ['the wrong direction', flow.replace('flowchart LR', 'flowchart TB'), 'first line must be "flowchart LR"'],
  ])('rejects %s', (_, source, message) => {
    expect(diagramErrors(source, 'LR').join('\n')).toContain(message);
  });
});
