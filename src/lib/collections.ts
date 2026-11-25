import {getCollection} from 'astro:content';
import type {Industry, ProofProject, UseCase} from '../content/schema';
import {INDUSTRY_ORDER} from '../data/order';
import {CATEGORY_ORDER} from '../data/categories';
import {isInProduction} from './content';

// Build-time access to the content collections, for pages. Plain scripts use scripts/content-checks.ts instead.

interface SiteContent {
  /** In CATEGORY_ORDER; within a category, use cases in production first, then by title. */
  useCases: UseCase[];
  /** In INDUSTRY_ORDER. */
  industries: Industry[];
  useCase: (slug: string) => UseCase;
  industry: (slug: string) => Industry;
  proofProject: (id: string) => ProofProject;
  /** The industries that list a use case, each with its note on how the use case works there. */
  industriesFor: (useCaseSlug: string) => {industry: Industry; note: string}[];
}

const lookup = <T>(items: readonly T[], key: (item: T) => string, kind: string) => {
  const byKey = new Map(items.map((item) => [key(item), item]));
  return (value: string) => {
    const item = byKey.get(value);
    if (!item) throw new Error(`Unknown ${kind} "${value}"`);
    return item;
  };
};

const position = (order: readonly string[], value: string) => {
  const index = order.indexOf(value);
  return index === -1 ? order.length : index;
};

async function load(): Promise<SiteContent> {
  const [useCaseEntries, industryEntries, proofEntries] = await Promise.all([
    getCollection('useCases'),
    getCollection('industries'),
    getCollection('proofProjects'),
  ]);
  const useCases = useCaseEntries
    .map((entry) => entry.data)
    .sort(
      (a, b) =>
        position(CATEGORY_ORDER, a.category) - position(CATEGORY_ORDER, b.category) ||
        Number(isInProduction(b)) - Number(isInProduction(a)) ||
        a.title.localeCompare(b.title),
    );
  const industries = industryEntries
    .map((entry) => entry.data)
    .sort((a, b) => position(INDUSTRY_ORDER, a.slug) - position(INDUSTRY_ORDER, b.slug));
  const proofProjects = proofEntries.map((entry) => entry.data);
  return {
    useCases,
    industries,
    useCase: lookup(useCases, (item) => item.slug, 'use case'),
    industry: lookup(industries, (item) => item.slug, 'industry'),
    proofProject: lookup(proofProjects, (item) => item.id, 'proof project'),
    industriesFor: (useCaseSlug) =>
      industries.flatMap((industry) =>
        industry.use_cases.filter((entry) => entry.use_case === useCaseSlug).map((entry) => ({industry, note: entry.note})),
      ),
  };
}

let cached: Promise<SiteContent> | undefined;

/** All content, sorted in display order. Loaded once per build. */
export const siteContent = () => (cached ??= load());
