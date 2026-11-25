import {z} from 'astro/zod';

// Shapes and counts follow docs/content/SCHEMA.md. Cross-file rules live in scripts/content-checks.ts.

const text = z.string().regex(/\S/, 'must not be blank');
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a lowercase-hyphenated slug');
const texts = (min: number, max: number) => z.array(text).min(min).max(max);

const titled = z.strictObject({title: text, detail: text});
const faq = z.strictObject({q: text, a: text});

/** `live`: running for a customer today. `early-access`: designed, and offered to a few brands as design partners. */
const useCaseStatus = z.enum(['live', 'early-access']);

export const useCaseSchema = z.strictObject({
  slug,
  title: text,
  status: useCaseStatus,
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
  pilot: z.strictObject({
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

export const proofProjectSchema = z.strictObject({
  id: slug,
  title: text,
  client_label: text,
  summary: text,
  publish_status: text,
});

export type UseCase = z.infer<typeof useCaseSchema>;
export type ProofProject = z.infer<typeof proofProjectSchema>;
