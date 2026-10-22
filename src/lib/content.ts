import type {Capability, Industry, UseCase} from '../content/schema';
import {APPROVED_PROOFS} from '../data/proofs';
import {USE_CASE_BATCHES} from '../data/release';

/** `CONTENT_PREVIEW=all` builds every use case, for local review only. */
export const PREVIEW_ALL = process.env.CONTENT_PREVIEW === 'all';

const releasedIndustries = new Set(USE_CASE_BATCHES.flatMap((batch) => batch.industries));

/** The page address for a capability, industry or use case, or undefined when that page isn't built. */
export const linkFor = (item: Capability | Industry | UseCase) =>
  'content_type' in item && !PREVIEW_ALL && !releasedIndustries.has(item.industry) ? undefined : item.url;

export const isProofApproved = (id: string | null) => id !== null && APPROVED_PROOFS.includes(id);
