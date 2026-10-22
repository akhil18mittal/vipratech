// Renders every built use case's Mermaid diagrams to static SVGs under public/diagrams/, so pages ship plain <img>s
// and no Mermaid runtime. Run with `bun scripts/render-diagrams.ts` (part of `bun run build`).
//
// Per built use case, three files in public/diagrams/<industry>/:
//   <slug>-flow.svg     flow_diagram as written (flowchart LR)
//   <slug>-flow-tb.svg  the same flow top-to-bottom, for narrow screens
//   <slug>-arch.svg     architecture.diagram (flowchart TB)
// public/diagrams/manifest.json maps each path (relative to public/) to {hash, width, height}. A diagram is re-rendered
// only when its hash (source + render config + renderer versions) changes. Files for use cases that aren't built are
// deleted, because everything in public/ is published.

import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, rmSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, join, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderMermaid} from '@mermaid-js/mermaid-cli';
import {linkFor} from '../src/lib/content';
import {launchChrome} from './chrome';
import {loadContent} from './content-checks';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const PUBLIC_DIR = join(ROOT, 'public');
const OUT_DIR = join(PUBLIC_DIR, 'diagrams');
const MANIFEST_PATH = join(OUT_DIR, 'manifest.json');
const CONCURRENCY = 8;

// Palette: the site's dark zinc surfaces with lime and emerald accents. The SVGs sit on a #18181b card, so they keep a
// transparent background and every colour below is chosen for contrast against that card.
const COLORS = {
  card: '#18181b', // zinc-900: rectangle fill, the same as the card behind the image
  cluster: '#0c0c0f', // subgraph fill, a shade darker than the card
  clusterBorder: '#27272a', // zinc-800
  nodeBorder: '#3f3f46', // zinc-700
  text: '#f4f4f5', // zinc-100
  edgeText: '#d4d4d8', // zinc-300
  edge: '#71717a', // zinc-500
  lime: '#a3e635', // lime-400: decisions, subgraph titles
  limeFill: '#1a2e05', // lime-950
  emerald: '#34d399', // emerald-400: human steps
  emeraldFill: '#022c22', // emerald-950
};

const FONT_FAMILY = 'Arial, Helvetica, "Liberation Sans", sans-serif';

// Every node shape is a `.label-container`: rectangles are a <rect>, round nodes (human steps) a <rect> with rx/ry and
// decisions a <polygon>. Subgraph titles get a chip in the subgraph's fill (see postProcess), so edges pass under them.
const THEME_CSS = `
  .node .label-container { fill: ${COLORS.card}; stroke: ${COLORS.nodeBorder}; stroke-width: 1.5px; }
  .node rect.label-container[rx]:not([rx="0"]) { fill: ${COLORS.emeraldFill}; stroke: ${COLORS.emerald}; }
  .node polygon.label-container { fill: ${COLORS.limeFill}; stroke: ${COLORS.lime}; }
  .node .label text { fill: ${COLORS.text}; }
  .cluster rect { fill: ${COLORS.cluster}; stroke: ${COLORS.clusterBorder}; stroke-width: 1px; }
  .cluster-label rect.background { fill: ${COLORS.cluster}; }
  .cluster-label text { fill: ${COLORS.lime}; }
  .flowchart-link { stroke: ${COLORS.edge}; stroke-width: 1.5px; }
  .marker { fill: ${COLORS.edge}; stroke: ${COLORS.edge}; }
  .edgeLabel rect.background { fill: ${COLORS.card}; opacity: 1; }
  .edgeLabel text { fill: ${COLORS.edgeText}; }
`;

const MERMAID_CONFIG = {
  theme: 'base',
  look: 'classic',
  darkMode: true,
  fontFamily: FONT_FAMILY,
  htmlLabels: false,
  deterministicIds: true,
  securityLevel: 'strict',
  logLevel: 'error',
  flowchart: {htmlLabels: false, useMaxWidth: false, diagramPadding: 8},
  themeVariables: {
    darkMode: true,
    fontFamily: FONT_FAMILY,
    fontSize: '16px',
    background: COLORS.card,
    primaryColor: COLORS.card,
    primaryBorderColor: COLORS.nodeBorder,
    primaryTextColor: COLORS.text,
    secondaryColor: COLORS.card,
    tertiaryColor: COLORS.cluster,
    mainBkg: COLORS.card,
    nodeBorder: COLORS.nodeBorder,
    nodeTextColor: COLORS.text,
    textColor: COLORS.text,
    lineColor: COLORS.edge,
    clusterBkg: COLORS.cluster,
    clusterBorder: COLORS.clusterBorder,
    titleColor: COLORS.lime,
    edgeLabelBackground: COLORS.card,
  },
  themeCSS: THEME_CSS,
} as const;

interface ManifestEntry {
  hash: string;
  width: number;
  height: number;
}

interface Job {
  /** Path relative to public/, e.g. diagrams/banking/x-flow.svg; also the manifest key. */
  path: string;
  /** What to call the diagram in error messages. */
  label: string;
  source: string;
  hash: string;
}

/** The version in the package.json of the package that owns `entryFile`. */
const packageVersion = (entryFile: string, name: string): string => {
  for (let dir = dirname(entryFile); dir !== dirname(dir); dir = dirname(dir)) {
    const file = join(dir, 'package.json');
    if (!existsSync(file)) continue;
    const pkg = JSON.parse(readFileSync(file, 'utf8')) as {name?: string; version?: string};
    if (pkg.name === name && pkg.version) return pkg.version;
  }
  throw new Error(`Could not find the installed version of ${name}`);
};

const cliEntry = fileURLToPath(import.meta.resolve('@mermaid-js/mermaid-cli'));
const RENDERER = {
  mermaidCli: packageVersion(cliEntry, '@mermaid-js/mermaid-cli'),
  mermaid: packageVersion(createRequire(cliEntry).resolve('mermaid'), 'mermaid'),
};

// Anything that changes the output belongs in the hash: the renderer versions, the Mermaid config and this script
// (which holds the post-processing).
const RENDER_KEY = JSON.stringify({renderer: RENDERER, config: MERMAID_CONFIG, script: readFileSync(fileURLToPath(import.meta.url), 'utf8')});
const hashOf = (source: string) => createHash('sha256').update(RENDER_KEY).update('\0').update(source).digest('hex').slice(0, 16);

const NUMBER = String.raw`-?\d+(?:\.\d+)?(?:e-?\d+)?`;
const VIEWBOX = new RegExp(String.raw`viewBox="(${NUMBER})\s+(${NUMBER})\s+(${NUMBER})\s+(${NUMBER})"`);
const SVG_NAMESPACES = /(xmlns(?::\w+)?)="http:\/\/www\.w3\.org\/[^"]*"/g;

// A subgraph as Mermaid draws it: <g class="cluster"><rect x y width height/><g class="cluster-label"
// transform="translate(lx, ly)"><g><rect class="background"/><text>..</text></g></g></g>. The title is centred, so its
// width is 2 * (x + width / 2 - lx).
const CLUSTER = new RegExp(
  String.raw`(<g class="cluster"[^>]*><rect[^>]*?\sx="(${NUMBER})"[^>]*?\swidth="(${NUMBER})"[^>]*/>)` +
    String.raw`<g class="cluster-label" transform="translate\((${NUMBER}),\s*(${NUMBER})\)"><g><rect class="background"[^>]*/>(<text[\s\S]*?</text>)</g></g>`,
  'g',
);

/**
 * Mermaid draws subgraph titles before the edges, so an edge entering a subgraph runs across its title. This lifts the
 * titles above the edges and gives each a chip in the subgraph's fill that the edges pass under.
 */
const raiseClusterTitles = (svg: string): string => {
  const titles: string[] = [];
  const out = svg.replace(CLUSTER, (_match, cluster: string, x: string, width: string, lx: string, ly: string, text: string) => {
    const titleWidth = 2 * Number(x) + Number(width) - 2 * Number(lx);
    // Each wrapped line of the title is a tspan row 1.1em (17.6px) below the last.
    const rows = Math.max(1, text.split('class="text-outer-tspan row"').length - 1);
    const chipHeight = 22 + (rows - 1) * 17.6;
    const chip = `<rect class="background" x="-8" y="1" width="${(titleWidth + 16).toFixed(2)}" height="${chipHeight.toFixed(1)}" rx="4"/>`;
    titles.push(`<g class="cluster-label" transform="translate(${lx}, ${ly})">${chip}${text}</g>`);
    return cluster;
  });
  const clusters = svg.split('<g class="cluster"').length - 1;
  if (titles.length !== clusters) throw new Error(`found ${clusters} subgraphs but could only restyle ${titles.length} titles`);
  if (titles.length === 0) return svg;
  if (out.split('<g class="nodes">').length !== 2) throw new Error('expected exactly one <g class="nodes"> group');
  return out.replace('<g class="nodes">', `<g class="cluster-labels">${titles.join('')}</g><g class="nodes">`);
};

/**
 * Gives the root <svg> a whole-pixel viewBox with matching width/height attributes (Mermaid writes width="100%" and a
 * max-width style), raises subgraph titles above the edges, drops scripts and checks for external references.
 */
const postProcess = (svg: string): {svg: string; width: number; height: number} => {
  const openEnd = svg.indexOf('>');
  if (!svg.startsWith('<svg') || openEnd === -1) throw new Error('output is not an <svg> document');
  let root = svg.slice(0, openEnd);
  let body = svg.slice(openEnd);

  const viewBox = VIEWBOX.exec(root);
  if (!viewBox) throw new Error('the <svg> has no viewBox');
  const [x, y, w, h] = viewBox.slice(1).map(Number) as [number, number, number, number];
  const width = Math.ceil(w);
  const height = Math.ceil(h);
  root = root
    .replace(/\s(?:width|height|style)="[^"]*"/g, '')
    .replace(VIEWBOX, `viewBox="${x} ${y} ${width} ${height}" width="${width}" height="${height}"`);

  body = raiseClusterTitles(body.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<script\b[^>]*\/>/gi, ''));

  const out = root + body;
  const external = out.replace(SVG_NAMESPACES, '').match(/https?:\/\/|@import|<foreignObject|<image\b|xlink:href="(?!#)|\shref="(?!#)/i);
  if (external) throw new Error(`the SVG contains an external reference or HTML label (${external[0]})`);
  return {svg: out, width, height};
};

const readManifest = (): Record<string, ManifestEntry> => {
  if (!existsSync(MANIFEST_PATH)) return {};
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as Record<string, ManifestEntry>;
  } catch {
    return {};
  }
};

/** Every file under `dir`, relative to public/ with forward slashes. */
const listFiles = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
        const full = join(dir, entry.name);
        return entry.isDirectory() ? listFiles(full) : [relative(PUBLIC_DIR, full).split(sep).join('/')];
      })
    : [];

const removeEmptyDirs = (dir: string) => {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    removeEmptyDirs(full);
    if (readdirSync(full).length === 0) rmdirSync(full);
  }
};

async function main() {
  const started = performance.now();
  const {content, errors} = loadContent(join(ROOT, 'src', 'content'));
  if (errors.length > 0) {
    console.error(`Cannot render diagrams: the content has ${errors.length} error(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  const jobs: Job[] = content.useCases
    .filter((useCase) => linkFor(useCase) !== undefined)
    .flatMap((useCase) => {
      const base = `diagrams/${useCase.industry}/${useCase.slug}`;
      const name = `${useCase.industry}/${useCase.slug}`;
      return [
        {path: `${base}-flow.svg`, label: `${name} flow_diagram`, source: useCase.flow_diagram},
        {path: `${base}-flow-tb.svg`, label: `${name} flow_diagram (top-to-bottom)`, source: useCase.flow_diagram.replace(/^flowchart LR\b/, 'flowchart TB')},
        {path: `${base}-arch.svg`, label: `${name} architecture.diagram`, source: useCase.architecture.diagram},
      ];
    })
    .map((job) => ({...job, hash: hashOf(job.source)}));

  const previous = readManifest();
  const manifest: Record<string, ManifestEntry> = {};
  const pending: Job[] = [];
  for (const job of jobs) {
    const entry = previous[job.path];
    if (entry?.hash === job.hash && existsSync(join(PUBLIC_DIR, job.path))) manifest[job.path] = entry;
    else pending.push(job);
  }

  // Delete whatever isn't a current output: diagrams of use cases that are no longer built, and stray files.
  const wanted = new Set([...jobs.map((job) => job.path), relative(PUBLIC_DIR, MANIFEST_PATH).split(sep).join('/')]);
  const stale = listFiles(OUT_DIR).filter((path) => !wanted.has(path));
  for (const path of stale) rmSync(join(PUBLIC_DIR, path));

  const failures: string[] = [];
  if (pending.length > 0) {
    const browser = await launchChrome();
    try {
      let next = 0;
      const worker = async () => {
        while (next < pending.length) {
          const job = pending[next++]!;
          try {
            const {data} = await renderMermaid(browser, job.source, 'svg', {
              backgroundColor: 'transparent',
              mermaidConfig: MERMAID_CONFIG,
              fontEmbed: false,
              // Unique ids keep the SVGs' internal references (CSS, arrow markers) apart if pages ever inline them.
              svgId: job.path.replace(/^diagrams\//, '').replace(/\.svg$/, '').replace(/[^a-z0-9]+/g, '-'),
            });
            const {svg, width, height} = postProcess(new TextDecoder().decode(data));
            const file = join(PUBLIC_DIR, job.path);
            mkdirSync(dirname(file), {recursive: true});
            writeFileSync(file, svg);
            manifest[job.path] = {hash: job.hash, width, height};
          } catch (error) {
            rmSync(join(PUBLIC_DIR, job.path), {force: true});
            failures.push(`${job.label} (${job.path}):\n      ${(error as Error).message.trim().split('\n').join('\n      ')}`);
          }
        }
      };
      await Promise.all(Array.from({length: Math.min(CONCURRENCY, pending.length)}, worker));
    } finally {
      await browser.close();
    }
  }

  mkdirSync(OUT_DIR, {recursive: true});
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`);
  removeEmptyDirs(OUT_DIR);

  const seconds = ((performance.now() - started) / 1000).toFixed(1);
  const rendered = pending.length - failures.length;
  console.log(`Diagrams: rendered ${rendered}, reused ${jobs.length - pending.length}, removed ${stale.length}, in ${seconds} s.`);
  if (failures.length > 0) {
    console.error(`Failed to render ${failures.length} diagram(s):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

try {
  await main();
} catch (error) {
  console.error(`Diagram rendering failed: ${(error as Error).stack ?? error}`);
  process.exit(1);
}
