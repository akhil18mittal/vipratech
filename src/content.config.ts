import {defineCollection} from 'astro:content';
import {file, glob} from 'astro/loaders';
import {proofProjectSchema, useCaseSchema} from './content/schema';

// Each use case's `slug` becomes its entry id. scripts/validate-content.ts checks the cross-file rules before every build.
const useCases = defineCollection({
  loader: glob({base: './src/content/use-cases', pattern: '*.json'}),
  schema: useCaseSchema,
});

const proofProjects = defineCollection({
  loader: file('src/content/proof-projects.json'),
  schema: proofProjectSchema,
});

export const collections = {useCases, proofProjects};
