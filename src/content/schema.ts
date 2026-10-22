import {z} from 'astro/zod';

// Shapes and counts follow docs/content/SCHEMA.md. Cross-file rules live in scripts/validate-content.ts.

const text = z.string().regex(/\S/, 'must not be blank');
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a lowercase-hyphenated slug');
const texts = (min: number, max: number) => z.array(text).min(min).max(max);

const titled = z.strictObject({title: text, detail: text});
const faq = z.strictObject({q: text, a: text});

const seo = (keywordsMin: number, keywordsMax: number, titleMax?: number) =>
  z.strictObject({
    title: titleMax ? text.max(titleMax) : text,
    description: text.max(155),
    keywords: texts(keywordsMin, keywordsMax),
  });

export const capabilitySchema = z.strictObject({
  slug,
  name: text,
  seo: seo(1, 8),
  hero: z.strictObject({headline: text, subheadline: text}),
  intro: text,
  what_we_build: texts(1, 10),
  how_we_work: texts(1, 10),
  proof_refs: z.array(slug),
  faqs: z.array(faq).min(1),
  url: text,
  use_cases: z.array(slug),
  industries: z.array(slug),
});

export const industrySchema = z.strictObject({
  slug,
  name: text,
  seo: seo(5, 8, 60),
  hero: z.strictObject({headline: text.max(90), subheadline: text}),
  intro: text,
  challenges: z.array(titled).length(4),
  capability_fit: z.array(z.strictObject({capability: slug, summary: text})).min(1).max(5),
  featured_use_cases: z.array(slug).length(3),
  use_cases: z.array(slug).length(10),
  regulatory_context: z.array(z.strictObject({name: text, note: text})).min(2).max(4),
  faqs: z.array(faq).length(4),
  related_industries: z.array(slug).length(3),
  cta: z.strictObject({headline: text, text}),
  url: text,
});

export const useCaseSchema = z.strictObject({
  slug,
  industry: slug,
  title: text,
  capability: slug,
  secondary_capabilities: z.array(slug).max(2),
  summary: text.max(200),
  seo: seo(4, 6, 60),
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
  pilot: z.strictObject({
    duration: text,
    scope: text,
    deliverables: texts(3, 5),
    what_we_measure: z.array(z.strictObject({metric: text, how: text})).min(3).max(4),
  }),
  faqs: z.array(faq).length(4),
  related: z.array(slug).min(3).max(4),
  proof_ref: slug.nullable(),
  content_type: z.literal('use-case'),
  url: text,
});

export const proofProjectSchema = z.strictObject({
  id: slug,
  title: text,
  client_label: text,
  capability: slug,
  summary: text,
  publish_status: text,
});

export type Capability = z.infer<typeof capabilitySchema>;
export type Industry = z.infer<typeof industrySchema>;
export type UseCase = z.infer<typeof useCaseSchema>;
export type ProofProject = z.infer<typeof proofProjectSchema>;
