import {z} from 'astro/zod';

// Shapes and counts follow docs/content/SCHEMA.md. Cross-file rules live in scripts/content-checks.ts.

const text = z.string().regex(/\S/, 'must not be blank');
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a lowercase-hyphenated slug');
const texts = (min: number, max: number) => z.array(text).min(min).max(max);

const titled = z.strictObject({title: text, detail: text});
const faq = z.strictObject({q: text, a: text});

/** The four groups the use case library and homepage show. Labels and display order are in src/data/categories.ts. */
const useCaseCategory = z.enum(['distributor-dealer', 'channel-deductions', 'ledgers-accruals', 'subsidy-freight-quality']);

/** Machine-style exception codes, as shown in the review queue: NO_INVOICE, OVER_CAP. */
const exceptionCode = z.string().regex(/^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/, 'must be an UPPER_SNAKE_CASE code').max(24);

export const useCaseSchema = z.strictObject({
  slug,
  title: text,
  category: useCaseCategory,
  summary: text.max(200),
  seo: z.strictObject({
    title: text.max(60),
    description: text.max(155),
    keywords: texts(4, 6),
  }),
  designed_for: texts(3, 4),
  problem: z.strictObject({intro: text, pain_points: z.array(titled).length(4)}),
  solution: z.strictObject({overview: text, capabilities: texts(5, 6)}),
  workflow: z.array(z.strictObject({step: z.int().positive(), title: text, detail: text})).min(5).max(7),
  flow_diagram: text,
  architecture: z.strictObject({
    layers: z.array(z.strictObject({name: text, components: texts(2, 4)})).min(4).max(6),
    diagram: text,
  }),
  inputs: texts(3, 6),
  outputs: texts(3, 6),
  human_in_the_loop: text,
  integrations: texts(3, 6),
  guardrails: texts(3, 5),
  compliance_notes: texts(0, 3),
  /** The screens a finance user works through, in order. */
  app_screens: z.array(z.strictObject({name: text.max(40), purpose: text, shows: texts(3, 4)})).min(4).max(6),
  /** The checks the decision engine applies to each line. */
  match_rules: z.array(z.strictObject({rule: text.max(60), logic: text})).min(4).max(6),
  /** The reasons a line is held for review. */
  exception_codes: z.array(z.strictObject({code: exceptionCode, meaning: text, action: text})).min(4).max(6),
  /** The main records the use case stores, with their key fields. */
  data_model: z.array(z.strictObject({entity: text.max(40), fields: texts(3, 6)})).min(3).max(5),
  rollout: z.strictObject({
    duration: text,
    scope: text,
    deliverables: texts(3, 5),
    what_we_measure: z.array(z.strictObject({metric: text, how: text})).min(3).max(4),
  }),
  faqs: z.array(faq).length(4),
  related: z.array(slug).min(1).max(3),
  proof_ref: slug.nullable(),
  url: text,
});

export const industrySchema = z.strictObject({
  slug,
  name: text,
  seo: z.strictObject({
    title: text.max(60),
    description: text.max(155),
    keywords: texts(4, 8),
  }),
  hero: z.strictObject({headline: text.max(90), subheadline: text}),
  intro: text,
  challenges: z.array(titled).length(4),
  /** The use cases that apply in this industry, each with a note on how it works there. */
  use_cases: z.array(z.strictObject({use_case: slug, note: text})).min(3).max(12),
  documents: texts(4, 8),
  /** The systems, portals and data sources this industry runs on, which the engine reads from. */
  systems: texts(3, 6),
  /** Public facts about the industry's channel economics, each with its source. */
  facts: z.array(z.strictObject({text: text.max(220), source: text, url: z.url()})).max(3),
  faqs: z.array(faq).min(3).max(4),
  url: text,
});

export const proofProjectSchema = z.strictObject({
  id: slug,
  title: text,
  client_label: text,
  summary: text,
  publish_status: text,
});

export type UseCase = z.infer<typeof useCaseSchema>;
export type Industry = z.infer<typeof industrySchema>;
export type ProofProject = z.infer<typeof proofProjectSchema>;
