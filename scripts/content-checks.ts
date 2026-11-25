import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {z} from 'astro/zod';
import {proofProjectSchema, useCaseSchema, type ProofProject, type UseCase} from '../src/content/schema';
import {APPROVED_PROOFS} from '../src/data/proofs';

export interface Content {
  useCases: UseCase[];
  proofProjects: ProofProject[];
}

const jsonFiles = (dir: string) => readdirSync(dir).filter((name) => name.endsWith('.json')).sort();

/** Reads every content file under `dir`, checking each one against its schema and its file name. */
export function loadContent(dir: string): {content: Content; errors: string[]} {
  const errors: string[] = [];

  const read = <T>(schema: z.ZodType<T>, file: string): T | undefined => {
    let data: unknown;
    try {
      data = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    } catch (error) {
      errors.push(`${file}: ${(error as Error).message}`);
      return undefined;
    }
    const result = schema.safeParse(data);
    if (result.success) return result.data;
    for (const issue of result.error.issues) errors.push(`${file}: ${issue.path.join('.') || '(root)'}: ${issue.message}`);
    return undefined;
  };

  const useCases = jsonFiles(join(dir, 'use-cases')).flatMap((name) => {
    const item = read(useCaseSchema, `use-cases/${name}`);
    if (item && name !== `${item.slug}.json`) errors.push(`use-cases/${name}: file name should be ${item.slug}.json`);
    return item ? [item] : [];
  });

  return {
    content: {useCases, proofProjects: read(z.array(proofProjectSchema), 'proof-projects.json') ?? []},
    errors,
  };
}

const duplicates = (values: readonly string[]) => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

const ID = '[A-Za-z][A-Za-z0-9]*';
const LABEL = String.raw`(?:\["[^"]*"\]|\("[^"]*"\)|\{"[^"]*"\})`;
const EDGE = String.raw`\s*-->\s*(?:\|"[^"]*"\|\s*)?`;
const STATEMENT = new RegExp(`^${ID}${LABEL}?(?:${EDGE}${ID}${LABEL}?)*$`);
const SUBGRAPH = new RegExp(String.raw`^subgraph (${ID})\["([^"]*)"\]$`);
const NODE = new RegExp(String.raw`(${ID})(?:\["([^"]*)"\]|\("([^"]*)"\)|\{"([^"]*)"\})?`, 'g');
const EDGE_LABEL = /\|"([^"]*)"\|/g;
const FORBIDDEN_IN_LABEL = /[|[\]{}()<>#;`&]/;

/**
 * Checks a Mermaid flowchart against the rules in docs/content/SCHEMA.md. Only the syntax the pages use is accepted:
 * quoted [..] (..) {..} nodes, `-->` edges with optional quoted labels, and subgraph/end blocks.
 */
export function diagramErrors(source: string, direction: 'LR' | 'TB'): string[] {
  const errors: string[] = [];
  const [header, ...lines] = source.split('\n');
  if (header !== `flowchart ${direction}`) errors.push(`first line must be "flowchart ${direction}"`);

  const nodeLabels = new Map<string, string>();
  const decisions = new Set<string>();
  const usedIds = new Set<string>();
  const subgraphIds = new Set<string>();
  const labels: string[] = [];
  let depth = 0;

  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (line === '') return;
    const subgraph = SUBGRAPH.exec(line);
    if (subgraph) {
      subgraphIds.add(subgraph[1]);
      labels.push(subgraph[2]);
      depth += 1;
      return;
    }
    if (line === 'end') {
      depth -= 1;
      if (depth < 0) errors.push(`line ${index + 2}: "end" without a matching subgraph`);
      return;
    }
    if (!STATEMENT.test(line)) {
      errors.push(`line ${index + 2}: unsupported syntax: ${line}`);
      return;
    }
    for (const [, label] of line.matchAll(EDGE_LABEL)) labels.push(label);
    for (const [, id, square, round, curly] of line.replace(EDGE_LABEL, '').matchAll(NODE)) {
      usedIds.add(id);
      const label = square ?? round ?? curly;
      if (label === undefined) continue;
      labels.push(label);
      if (curly !== undefined) decisions.add(id);
      const previous = nodeLabels.get(id);
      if (previous !== undefined && previous !== label) errors.push(`node ${id} is used for two different labels: "${previous}" and "${label}"`);
      nodeLabels.set(id, label);
    }
  });

  if (depth > 0) errors.push('a subgraph is missing its "end"');
  for (const id of usedIds) if (!nodeLabels.has(id) && !subgraphIds.has(id)) errors.push(`node ${id} has no label`);
  for (const id of subgraphIds) if (nodeLabels.has(id)) errors.push(`subgraph ID ${id} is also used as a node ID`);
  for (const label of labels) {
    if (label.trim() === '') errors.push('a label is empty');
    if (label.length > 40) errors.push(`label is longer than 40 characters: "${label}"`);
    if (FORBIDDEN_IN_LABEL.test(label)) errors.push(`label contains a character Mermaid labels must not use: "${label}"`);
  }

  const nodes = nodeLabels.size;
  if (direction === 'LR') {
    if (nodes < 6 || nodes > 10) errors.push(`has ${nodes} nodes; a flow diagram needs 6-10`);
    if (decisions.size === 0) errors.push('needs at least one decision node {"..."}');
  } else {
    if (subgraphIds.size < 3 || subgraphIds.size > 5) errors.push(`has ${subgraphIds.size} subgraphs; an architecture diagram needs 3-5`);
    if (nodes < 8 || nodes > 14) errors.push(`has ${nodes} nodes; an architecture diagram needs 8-14`);
  }
  return errors;
}

/** Checks the rules that span files: references, URLs, step numbering and the diagrams. */
export function findContentErrors({useCases, proofProjects}: Content): string[] {
  const errors: string[] = [];
  const reporter = (subject: string) => (message: string) => errors.push(`${subject}: ${message}`);

  const useCasesBySlug = new Map(useCases.map((useCase) => [useCase.slug, useCase]));
  const proofIds = new Set(proofProjects.map((proof) => proof.id));

  const checkRefs = (fail: (message: string) => void, field: string, refs: readonly string[], known: ReadonlySet<string> | ReadonlyMap<string, unknown>, self?: string) => {
    for (const ref of refs) if (!known.has(ref)) fail(`${field} refers to unknown "${ref}"`);
    for (const ref of duplicates(refs)) fail(`${field} lists "${ref}" more than once`);
    if (self !== undefined && refs.includes(self)) fail(`${field} must not include "${self}"`);
  };

  for (const [what, values] of [
    ['use case slug', useCases.map((useCase) => useCase.slug)],
    ['proof project id', proofProjects.map((proof) => proof.id)],
  ] as const) {
    for (const value of duplicates(values)) errors.push(`duplicate ${what}: ${value}`);
  }

  if (!useCases.some((useCase) => useCase.status === 'live')) errors.push('at least one use case must be live');

  for (const useCase of useCases) {
    const fail = reporter(`use case ${useCase.slug}`);
    if (useCase.url !== `/use-cases/${useCase.slug}/`) fail(`url should be /use-cases/${useCase.slug}/`);
    checkRefs(fail, 'related', useCase.related, useCasesBySlug, useCase.slug);
    if (useCase.proof_ref !== null && !proofIds.has(useCase.proof_ref)) fail(`proof_ref refers to unknown "${useCase.proof_ref}"`);
    useCase.workflow.forEach((step, index) => {
      if (step.step !== index + 1) fail(`workflow step ${index + 1} is numbered ${step.step}`);
    });
    for (const error of diagramErrors(useCase.flow_diagram, 'LR')) fail(`flow_diagram ${error}`);
    for (const error of diagramErrors(useCase.architecture.diagram, 'TB')) fail(`architecture.diagram ${error}`);
  }

  checkRefs(reporter('src/data/proofs.ts'), 'APPROVED_PROOFS', APPROVED_PROOFS, proofIds);

  return errors;
}
