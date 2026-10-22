import {defineCollection} from 'astro:content';
import {file, glob} from 'astro/loaders';
import {capabilitySchema, industrySchema, proofProjectSchema, useCaseSchema} from './content/schema';

// Each JSON file's `slug` becomes its entry id. scripts/validate-content.ts checks the cross-file rules before every build.
const capabilities = defineCollection({
  loader: glob({base: './src/content/capabilities', pattern: '*.json'}),
  schema: capabilitySchema,
});

const industries = defineCollection({
  loader: glob({base: './src/content/industries', pattern: '*.json'}),
  schema: industrySchema,
});

const useCases = defineCollection({
  loader: glob({base: './src/content/use-cases', pattern: '*/*.json'}),
  schema: useCaseSchema,
});

const proofProjects = defineCollection({
  loader: file('src/content/proof-projects.json'),
  schema: proofProjectSchema,
});

export const collections = {capabilities, industries, useCases, proofProjects};
