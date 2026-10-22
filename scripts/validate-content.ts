import {fileURLToPath} from 'node:url';
import {findContentErrors, loadContent} from './content-checks';

const {content, errors} = loadContent(fileURLToPath(new URL('../src/content/', import.meta.url)));
// Cross-file checks only make sense once every file has parsed.
if (errors.length === 0) errors.push(...findContentErrors(content));

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const {capabilities, industries, useCases, proofProjects} = content;
console.log(
  `Content OK: ${capabilities.length} capabilities, ${industries.length} industries, ${useCases.length} use cases, ${proofProjects.length} proof projects.`,
);
