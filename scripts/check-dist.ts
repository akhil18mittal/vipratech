import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {APPROVED_PROOFS} from '../src/data/proofs';
import {CALENDLY_PLACEHOLDER, PRIVACY_POLICY_APPROVED_ON} from '../src/data/site';
import {launchChrome} from './chrome';
import {loadContent} from './content-checks';
import {DIST, fileFor, listPages, pathOf} from './dist';

// Checks the built site in dist/ before it goes live: head tags, structured data, links and images, the sitemap, and
// that nothing unready (the draft privacy policy, unapproved proofs) is published. Pages still linking to the Calendly
// placeholder are reported as a warning. Pages are read as served, without running their JavaScript, which is what
// search engines see first.

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SITE = 'https://vipratech.in';
// The homepage is drawn in the browser by the React app, so its HTML has no H1.
const CLIENT_RENDERED = new Set(['/']);
const NOINDEX = new Set(['/404.html']);

interface PageData {
  h1s: number;
  title: string;
  meta: Record<string, string>;
  canonical: string | null;
  jsonLd: string[];
  ids: string[];
  refs: string[];
  text: string;
  html: string;
}

async function readPages(): Promise<Map<string, PageData>> {
  const browser = await launchChrome();
  try {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on('request', (request) => void request.abort());
    const pages = new Map<string, PageData>();
    for (const {path, file} of listPages()) {
      const html = readFileSync(file, 'utf8');
      await page.setContent(html, {waitUntil: 'domcontentloaded'});
      const data = await page.evaluate(() => {
        const all = (selector: string) => [...document.querySelectorAll(selector)];
        const meta: Record<string, string> = {};
        for (const tag of all('meta[name], meta[property]')) {
          meta[tag.getAttribute('name') ?? tag.getAttribute('property') ?? ''] = tag.getAttribute('content') ?? '';
        }
        return {
          h1s: all('h1').length,
          title: document.title,
          meta,
          canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href') ?? null,
          jsonLd: all('script[type="application/ld+json"]').map((script) => script.textContent ?? ''),
          ids: all('[id]').map((element) => element.id),
          refs: [
            ...all('a[href]').map((element) => element.getAttribute('href') ?? ''),
            ...all('img[src], script[src]').map((element) => element.getAttribute('src') ?? ''),
            ...all('link[href]:not([rel=canonical])').map((element) => element.getAttribute('href') ?? ''),
            ...all('source[srcset]').map((element) => element.getAttribute('srcset') ?? ''),
          ],
          text: document.body.textContent ?? '',
        };
      });
      pages.set(path, {...data, html});
    }
    return pages;
  } finally {
    await browser.close();
  }
}

async function main() {
  const errors: string[] = [];
  const pages = await readPages();

  if (PRIVACY_POLICY_APPROVED_ON === null) {
    errors.push('The privacy policy is still a draft: set PRIVACY_POLICY_APPROVED_ON in src/data/site.ts once approved');
  }

  const {content} = loadContent(join(ROOT, 'src', 'content'));
  const approved = content.proofProjects.filter((proof) => APPROVED_PROOFS.includes(proof.id));
  const hidden = content.proofProjects
    .filter((proof) => !APPROVED_PROOFS.includes(proof.id))
    .flatMap((proof) => [
      proof.title,
      proof.summary,
      // Several proofs share a label; only a label no approved proof uses gives a hidden proof away.
      ...(approved.some((other) => other.client_label === proof.client_label) ? [] : [proof.client_label]),
    ]);

  const indexable: string[] = [];
  let placeholderPages = 0;
  for (const [path, page] of pages) {
    const fail = (message: string) => errors.push(`${path}: ${message}`);
    const noindex = page.meta.robots?.includes('noindex') ?? false;
    if (!noindex) indexable.push(`${SITE}${path}`);
    if (noindex && !NOINDEX.has(path)) fail('is marked noindex (is this a CONTENT_PREVIEW build?)');

    if (page.h1s !== 1 && !CLIENT_RENDERED.has(path)) fail(`has ${page.h1s} H1 headings, expected 1`);
    if (!page.title.trim()) fail('has no <title>');
    for (const name of ['description', 'og:title', 'og:description', 'og:image', 'twitter:card']) {
      if (!page.meta[name]?.trim()) fail(`has no ${name} meta tag`);
    }
    if (!noindex) {
      if (page.canonical !== `${SITE}${path}`) fail(`canonical is ${page.canonical}, expected ${SITE}${path}`);
      if (page.meta['og:url'] !== page.canonical) fail(`og:url ${page.meta['og:url']} differs from the canonical`);
    }
    for (const json of page.jsonLd) {
      try {
        JSON.parse(json);
      } catch (error) {
        fail(`has JSON-LD that doesn't parse: ${(error as Error).message}`);
      }
    }

    const ids = new Set(page.ids);
    for (const ref of [...page.refs, page.meta['og:image'] ?? '']) {
      const local = ref.startsWith(SITE) ? ref.slice(SITE.length) : ref;
      if (local.startsWith('#')) {
        if (local.length > 1 && !ids.has(decodeURIComponent(local.slice(1)))) fail(`links to missing anchor ${local}`);
        continue;
      }
      if (!local.startsWith('/') || local.startsWith('//')) continue;
      const url = new URL(local, SITE);
      const target = fileFor(url.pathname);
      if (!target) {
        fail(`links to ${ref}, which isn't in dist/`);
      } else if (url.hash && target.endsWith('.html')) {
        const targetPage = pages.get(pathOf(target));
        if (!targetPage?.ids.includes(decodeURIComponent(url.hash.slice(1)))) fail(`links to missing anchor ${ref}`);
      }
    }

    if (page.html.includes(CALENDLY_PLACEHOLDER)) placeholderPages++;
    for (const text of hidden) if (page.text.includes(text)) fail(`shows an unapproved proof project: "${text}"`);
  }

  const sitemapFile = join(DIST, 'sitemap.xml');
  if (!existsSync(sitemapFile)) {
    errors.push('dist/sitemap.xml is missing');
  } else {
    const listed = [...readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const listedSet = new Set(listed);
    if (listedSet.size !== listed.length) errors.push('sitemap.xml lists a page more than once');
    for (const url of indexable) if (!listedSet.has(url)) errors.push(`sitemap.xml is missing ${url}`);
    for (const url of listedSet) if (!indexable.includes(url)) errors.push(`sitemap.xml lists ${url}, which isn't an indexable page`);
  }
  const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
  if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) errors.push('robots.txt is missing or doesn\'t point to the sitemap');

  if (placeholderPages > 0) {
    console.warn(`Warning: ${placeholderPages} page(s) link to the Calendly placeholder; set CALENDLY_URL in src/data/site.ts`);
  }
  if (errors.length > 0) {
    console.error(`dist/ check failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log(`dist/ OK: ${pages.size} pages, ${indexable.length} in the sitemap.`);
}

await main();
