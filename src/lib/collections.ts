import {getCollection} from 'astro:content';
import type {ProofProject, UseCase} from '../content/schema';

// Build-time access to the content collections, for pages. Plain scripts use scripts/content-checks.ts instead.

interface SiteContent {
  /** Live use cases first, then early access, each group in title order. */
  useCases: UseCase[];
  useCase: (slug: string) => UseCase;
  proofProject: (id: string) => ProofProject;
}

const lookup = <T>(items: readonly T[], key: (item: T) => string, kind: string) => {
  const byKey = new Map(items.map((item) => [key(item), item]));
  return (value: string) => {
    const item = byKey.get(value);
    if (!item) throw new Error(`Unknown ${kind} "${value}"`);
    return item;
  };
};

const statusOrder = (useCase: UseCase) => (useCase.status === 'live' ? 0 : 1);

async function load(): Promise<SiteContent> {
  const [useCaseEntries, proofEntries] = await Promise.all([getCollection('useCases'), getCollection('proofProjects')]);
  const useCases = useCaseEntries
    .map((entry) => entry.data)
    .sort((a, b) => statusOrder(a) - statusOrder(b) || a.title.localeCompare(b.title));
  const proofProjects = proofEntries.map((entry) => entry.data);
  return {
    useCases,
    useCase: lookup(useCases, (item) => item.slug, 'use case'),
    proofProject: lookup(proofProjects, (item) => item.id, 'proof project'),
  };
}

let cached: Promise<SiteContent> | undefined;

/** All content, sorted in display order. Loaded once per build. */
export const siteContent = () => (cached ??= load());
