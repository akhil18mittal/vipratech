import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import type {UseCase} from '../content/schema';
import type {Diagram} from '../types';

// The diagrams scripts/render-diagrams.ts wrote to public/diagrams/ (`bun run build` runs it before Astro), with the
// sizes it recorded in their manifest.

type Manifest = Record<string, {hash: string; width: number; height: number}>;

let manifest: Manifest | undefined;

export function diagramFor(useCase: UseCase, kind: 'flow' | 'flow-tb' | 'arch'): Diagram {
  manifest ??= JSON.parse(readFileSync(join(process.cwd(), 'public/diagrams/manifest.json'), 'utf8')) as Manifest;
  const path = `diagrams/${useCase.industry}/${useCase.slug}-${kind}.svg`;
  const entry = manifest[path];
  if (!entry) throw new Error(`No diagram ${path}: run \`bun run diagrams\``);
  return {src: `/${path}`, width: entry.width, height: entry.height};
}
