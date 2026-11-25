import {defineCollection} from 'astro:content';
import {file, glob} from 'astro/loaders';
import {industrySchema, proofProjectSchema, useCaseSchema} from './content/schema';

// Each use case's and industry's `slug` becomes its entry id. scripts/validate-content.ts checks the cross-file rules before every build.
const useCases = defineCollection({
  loader: glob({base: './src/content/use-cases', pattern: '*.json'}),
  schema: useCaseSchema,
});

const industries = defineCollection({
  loader: glob({base: './src/content/industries', pattern: '*.json'}),
  schema: industrySchema,
});

const proofProjects = defineCollection({
  loader: file('src/content/proof-projects.json'),
  schema: proofProjectSchema,
});

export const collections = {useCases, industries, proofProjects};
