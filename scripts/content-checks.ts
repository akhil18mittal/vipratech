import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {z} from 'astro/zod';
import {
  capabilitySchema,
  industrySchema,
  proofProjectSchema,
  useCaseSchema,
  type Capability,
  type Industry,
  type ProofProject,
  type UseCase,
} from '../src/content/schema';
import {CAPABILITY_ORDER, INDUSTRY_ORDER} from '../src/data/order';
import {APPROVED_PROOFS} from '../src/data/proofs';
import {USE_CASE_BATCHES} from '../src/data/release';
import {capabilityIndustries, capabilityUseCases} from '../src/lib/derive';

export interface Content {
  capabilities: Capability[];
  industries: Industry[];
  useCases: UseCase[];
  proofProjects: ProofProject[];
}

const jsonFiles = (dir: string) => readdirSync(dir).filter((name) => name.endsWith('.json')).sort();

/** Reads every content file under `dir`, checking each one against its schema, its file name and its folder. */
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

  const readFolder = <T extends {slug: string}>(schema: z.ZodType<T>, folder: string) =>
    jsonFiles(join(dir, folder)).flatMap((name) => {
      const item = read(schema, `${folder}/${name}`);
      if (item && name !== `${item.slug}.json`) errors.push(`${folder}/${name}: file name should be ${item.slug}.json`);
      return item ? [item] : [];
    });

  const useCaseFolders = readdirSync(join(dir, 'use-cases'), {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const useCases = useCaseFolders.flatMap((folder) => {
    const items = readFolder(useCaseSchema, `use-cases/${folder}`);
    for (const useCase of items) {
      if (useCase.industry !== folder) errors.push(`use-cases/${folder}/: ${useCase.slug} has industry "${useCase.industry}", so it belongs in use-cases/${useCase.industry}/`);
    }
    return items;
  });

  return {
    content: {
      capabilities: readFolder(capabilitySchema, 'capabilities'),
      industries: readFolder(industrySchema, 'industries'),
      useCases,
      proofProjects: read(z.array(proofProjectSchema), 'proof-projects.json') ?? [],
    },
    errors,
  };
}

const duplicates = (values: readonly string[]) => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

const sameSet = (a: readonly string[], b: readonly string[]) => {
  const left = new Set(a);
  const right = new Set(b);
  return left.size === right.size && [...left].every((value) => right.has(value));
};

const listDiff = (actual: readonly string[], expected: readonly string[]) => {
  const missing = expected.filter((value) => !actual.includes(value));
  const extra = actual.filter((value) => !expected.includes(value));
  if (missing.length === 0 && extra.length === 0) return `expected this order: ${expected.join(', ')}`;
  return [missing.length > 0 && `missing ${missing.join(', ')}`, extra.length > 0 && `unexpected ${extra.join(', ')}`].filter(Boolean).join('; ');
};

const ID = '[A-Za-z][A-Za-z0-9]*';
const LABEL = String.raw`(?:\["[^"]*"\]|\("[^"]*"\)|\{"[^"]*"\})`;
const EDGE = String.raw`\s*-->\s*(?:\|"[^"]*"\|\s*)?`;
const STATEMENT = new RegExp(`^${ID}${LABEL}?(?:${EDGE}${ID}${LABEL}?)*$`);
const SUBGRAPH = new RegExp(String.raw`^subgraph (${ID})\["([^"]*)"\]$`);
const NODE = new RegExp(String.raw`(${ID})(?:\["([^"]*)"\]|\("([^"]*)"\)|\{"([^"]*)"\})?`, 'g');
const EDGE_LABEL = /\|"([^"]*)"\|/g;
const FORBIDDEN_IN_LABEL = /[|[\]{}()<>#;`&]/;

/**
 * Checks a Mermaid flowchart against the rules in docs/content/SCHEMA.md. Only the syntax the pack uses is accepted:
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

/** Checks the rules that span files: references, URLs, display order and the lists derived from other files. */
export function findContentErrors({capabilities, industries, useCases, proofProjects}: Content): string[] {
  const errors: string[] = [];
  const reporter = (subject: string) => (message: string) => errors.push(`${subject}: ${message}`);

  const capabilitySlugs = new Set(capabilities.map((capability) => capability.slug));
  const industrySlugs = new Set(industries.map((industry) => industry.slug));
  const useCasesBySlug = new Map(useCases.map((useCase) => [useCase.slug, useCase]));
  const proofIds = new Set(proofProjects.map((proof) => proof.id));

  const checkRefs = (fail: (message: string) => void, field: string, refs: readonly string[], known: ReadonlySet<string> | ReadonlyMap<string, unknown>, self?: string) => {
    for (const ref of refs) if (!known.has(ref)) fail(`${field} refers to unknown "${ref}"`);
    for (const ref of duplicates(refs)) fail(`${field} lists "${ref}" more than once`);
    if (self !== undefined && refs.includes(self)) fail(`${field} must not include "${self}"`);
  };

  for (const [what, values] of [
    ['capability slug', capabilities.map((capability) => capability.slug)],
    ['industry slug', industries.map((industry) => industry.slug)],
    ['use case slug', useCases.map((useCase) => useCase.slug)],
    ['proof project id', proofProjects.map((proof) => proof.id)],
  ] as const) {
    for (const value of duplicates(values)) errors.push(`duplicate ${what}: ${value}`);
  }

  for (const [name, order, slugs] of [
    ['CAPABILITY_ORDER', CAPABILITY_ORDER, capabilitySlugs],
    ['INDUSTRY_ORDER', INDUSTRY_ORDER, industrySlugs],
  ] as const) {
    const fail = reporter(`src/data/order.ts ${name}`);
    for (const slug of duplicates(order)) fail(`lists "${slug}" more than once`);
    for (const slug of order) if (!slugs.has(slug)) fail(`lists "${slug}", which has no content file`);
    for (const slug of slugs) if (!(order as readonly string[]).includes(slug)) fail(`is missing "${slug}"`);
  }

  for (const capability of capabilities) {
    const fail = reporter(`capability ${capability.slug}`);
    if (capability.url !== `/solutions/${capability.slug}/`) fail(`url should be /solutions/${capability.slug}/`);
    checkRefs(fail, 'proof_refs', capability.proof_refs, proofIds);
    const expectedUseCases = capabilityUseCases(capability.slug, industries, useCases).map((useCase) => useCase.slug);
    if (capability.use_cases.join() !== expectedUseCases.join()) fail(`use_cases is out of date: ${listDiff(capability.use_cases, expectedUseCases)}`);
    const expectedIndustries = capabilityIndustries(capability.slug, industries, useCases).map((industry) => industry.slug);
    if (!sameSet(capability.industries, expectedIndustries)) fail(`industries is out of date: ${listDiff(capability.industries, expectedIndustries)}`);
  }

  for (const industry of industries) {
    const fail = reporter(`industry ${industry.slug}`);
    if (industry.url !== `/industries/${industry.slug}/`) fail(`url should be /industries/${industry.slug}/`);
    const own = useCases.filter((useCase) => useCase.industry === industry.slug);
    checkRefs(fail, 'use_cases', industry.use_cases, useCasesBySlug);
    const ownSlugs = own.map((useCase) => useCase.slug);
    if (!sameSet(industry.use_cases, ownSlugs)) fail(`use_cases must list exactly the files in use-cases/${industry.slug}/: ${listDiff(industry.use_cases, ownSlugs)}`);
    checkRefs(fail, 'featured_use_cases', industry.featured_use_cases, new Set(industry.use_cases));
    checkRefs(fail, 'related_industries', industry.related_industries, industrySlugs, industry.slug);
    const fit = industry.capability_fit.map((entry) => entry.capability);
    checkRefs(fail, 'capability_fit', fit, capabilitySlugs);
    const used = [...new Set(own.flatMap((useCase) => [useCase.capability, ...useCase.secondary_capabilities]))];
    if (!sameSet(fit, used)) fail(`capability_fit must cover every capability its use cases use: ${listDiff(fit, used)}`);
  }

  for (const useCase of useCases) {
    const fail = reporter(`use case ${useCase.slug}`);
    if (useCase.url !== `/use-cases/${useCase.industry}/${useCase.slug}/`) fail(`url should be /use-cases/${useCase.industry}/${useCase.slug}/`);
    if (!industrySlugs.has(useCase.industry)) fail(`industry "${useCase.industry}" is unknown`);
    if (!capabilitySlugs.has(useCase.capability)) fail(`capability "${useCase.capability}" is unknown`);
    checkRefs(fail, 'secondary_capabilities', useCase.secondary_capabilities, capabilitySlugs, useCase.capability);
    checkRefs(fail, 'related', useCase.related, useCasesBySlug, useCase.slug);
    if (useCase.proof_ref !== null && !proofIds.has(useCase.proof_ref)) fail(`proof_ref refers to unknown "${useCase.proof_ref}"`);
    useCase.workflow.forEach((step, index) => {
      if (step.step !== index + 1) fail(`workflow step ${index + 1} is numbered ${step.step}`);
    });
    for (const error of diagramErrors(useCase.flow_diagram, 'LR')) fail(`flow_diagram ${error}`);
    for (const error of diagramErrors(useCase.architecture.diagram, 'TB')) fail(`architecture.diagram ${error}`);
  }

  for (const proof of proofProjects) {
    if (!capabilitySlugs.has(proof.capability)) errors.push(`proof project ${proof.id}: capability "${proof.capability}" is unknown`);
  }

  checkRefs(reporter('src/data/proofs.ts'), 'APPROVED_PROOFS', APPROVED_PROOFS, proofIds);
  const releaseFail = reporter('src/data/release.ts');
  checkRefs(releaseFail, 'USE_CASE_BATCHES', USE_CASE_BATCHES.flatMap((batch) => batch.industries), industrySlugs);
  for (const {releasedOn} of USE_CASE_BATCHES) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(releasedOn) || Number.isNaN(Date.parse(releasedOn))) releaseFail(`releasedOn "${releasedOn}" is not a YYYY-MM-DD date`);
  }

  return errors;
}
