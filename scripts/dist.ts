import {existsSync, readdirSync, statSync} from 'node:fs';
import {join, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

// The built site in dist/, as the checks on it see it.

export const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

const listHtml = (dir: string): string[] =>
  readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listHtml(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });

/** The address a file in dist/ is served at: about/index.html is /about/, 404.html is /404.html. */
export const pathOf = (file: string) =>
  `/${relative(DIST, file).split(sep).join('/')}`.replace(/(^|\/)index\.html$/, '$1');

/** Every page in dist/, sorted by address. */
export const listPages = (): {path: string; file: string}[] => {
  if (!existsSync(DIST)) throw new Error('No dist/ folder: run `bun run build` first.');
  return listHtml(DIST)
    .map((file) => ({path: pathOf(file), file}))
    .sort((a, b) => a.path.localeCompare(b.path));
};

/** The file in dist/ an address resolves to, or undefined if there is none. */
export const fileFor = (path: string) => {
  const file = join(DIST, decodeURIComponent(path), path.endsWith('/') ? 'index.html' : '');
  return existsSync(file) && statSync(file).isFile() ? file : undefined;
};
