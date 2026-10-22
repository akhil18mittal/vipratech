import {getCollection} from 'astro:content';
import type {Capability, Industry, ProofProject, UseCase} from '../content/schema';
import {CAPABILITY_ORDER, INDUSTRY_ORDER} from '../data/order';
import type {HomeLinks} from '../types';
import {inOrder} from './derive';

// Build-time access to the content collections, for pages. Plain scripts use scripts/content-checks.ts instead.

interface SiteContent {
  capabilities: Capability[];
  industries: Industry[];
  useCases: UseCase[];
  proofProjects: ProofProject[];
  capability: (slug: string) => Capability;
  industry: (slug: string) => Industry;
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

async function load(): Promise<SiteContent> {
  const [capabilities, industries, useCases, proofProjects] = await Promise.all([
    getCollection('capabilities'),
    getCollection('industries'),
    getCollection('useCases'),
    getCollection('proofProjects'),
  ]);
  const site = {
    capabilities: inOrder(capabilities.map((entry) => entry.data), CAPABILITY_ORDER),
    industries: inOrder(industries.map((entry) => entry.data), INDUSTRY_ORDER),
    useCases: useCases.map((entry) => entry.data),
    proofProjects: proofProjects.map((entry) => entry.data),
  };
  return {
    ...site,
    capability: lookup(site.capabilities, (item) => item.slug, 'capability'),
    industry: lookup(site.industries, (item) => item.slug, 'industry'),
    useCase: lookup(site.useCases, (item) => item.slug, 'use case'),
    proofProject: lookup(site.proofProjects, (item) => item.id, 'proof project'),
  };
}

let cached: Promise<SiteContent> | undefined;

/** All content, sorted in display order. Loaded once per build. */
export const siteContent = () => (cached ??= load());

/** Header, footer and homepage links to the solution and industry pages. */
export async function siteLinks(): Promise<HomeLinks> {
  const {capabilities, industries} = await siteContent();
  return {
    solutions: capabilities.map((capability) => ({
      name: capability.name,
      href: capability.url,
      headline: capability.hero.headline,
    })),
    industries: industries.map((industry) => ({name: industry.name, href: industry.url})),
  };
}
