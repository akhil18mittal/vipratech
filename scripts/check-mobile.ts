import {readFileSync} from 'node:fs';
import {createServer} from 'node:http';
import type {AddressInfo} from 'node:net';
import {extname, join} from 'node:path';
import {setTimeout as sleep} from 'node:timers/promises';
import type {Page} from 'puppeteer';
import {launchChrome} from './chrome';
import {DIST, fileFor, listPages} from './dist';

// Opens one page of each template from dist/ at phone width and fails if the page scrolls sideways. Content inside a
// box that scrolls on its own (the diagrams) is fine.

const WIDTH = 400;
const TEMPLATES: [string, RegExp][] = [
  ['homepage', /^\/$/],
  ['solution', /^\/solutions\/[^/]+\/$/],
  ['industries hub', /^\/industries\/$/],
  ['industry', /^\/industries\/[^/]+\/$/],
  ['use case library', /^\/use-cases\/$/],
  ['use case', /^\/use-cases\/[^/]+\/[^/]+\/$/],
  ['careers', /^\/careers\/$/],
  ['privacy', /^\/privacy\/$/],
  ['not found', /^\/404\.html$/],
];
const TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
};

const findOverflow = (page: Page) =>
  page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    // The page shells (<main>, and the homepage's full-height wrapper) clip sideways overflow, so a too-wide element
    // is cut off rather than scrolling the page. Smaller boxes that clip (the homepage ticker) or scroll (diagrams)
    // do it on purpose, and so does the homepage's moving background, which ignores the pointer.
    const clippedOnPurpose = (element: Element) => {
      for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        const {overflowX} = getComputedStyle(parent);
        if (overflowX === 'auto' || overflowX === 'scroll') return true;
        const shell = parent.tagName === 'MAIN' || parent.getBoundingClientRect().height >= window.innerHeight;
        if (overflowX !== 'visible' && !shell) return true;
      }
      return false;
    };
    const culprits = [...document.body.querySelectorAll('*')].filter((element) => {
      const box = element.getBoundingClientRect();
      const decorative = getComputedStyle(element).pointerEvents === 'none';
      return box.width > 0 && box.right > width + 1 && !decorative && !clippedOnPurpose(element);
    });
    if (culprits.length === 0 && document.documentElement.scrollWidth <= width) return null;
    return {
      scrollWidth: document.documentElement.scrollWidth,
      culprits: culprits.slice(0, 8).map((element) => {
        const classes = typeof element.className === 'string' ? element.className.trim().split(/\s+/).slice(0, 4).join('.') : '';
        const right = Math.round(element.getBoundingClientRect().right);
        return `<${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${classes ? `.${classes}` : ''}> to ${right}px`;
      }),
    };
  });

async function main() {
  const pages = listPages();
  const errors: string[] = [];
  const picks = TEMPLATES.flatMap(([name, pattern]) => {
    const page = pages.find(({path}) => pattern.test(path));
    if (!page) errors.push(`no ${name} page in dist/`);
    return page ? [{name, path: page.path}] : [];
  });

  const server = createServer((request, response) => {
    const file = fileFor(new URL(request.url ?? '/', 'http://localhost').pathname);
    response.writeHead(file ? 200 : 404, {'content-type': TYPES[extname(file ?? '.html')] ?? 'application/octet-stream'});
    response.end(readFileSync(file ?? join(DIST, '404.html')));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const browser = await launchChrome();
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(20_000);
    await page.setViewport({width: WIDTH, height: 900, isMobile: true, hasTouch: true});
    await page.setRequestInterception(true);
    page.on('request', (request) => void (request.url().startsWith(origin) ? request.continue() : request.abort()));

    for (const {name, path} of picks) {
      await page.goto(`${origin}${path}`, {waitUntil: 'load'});
      await page.evaluate(async () => {
        const images = [...document.images];
        for (const image of images) image.loading = 'eager';
        await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
      });
      // Gives the homepage's React app time to draw.
      await sleep(1_000);
      // Its entrance animations slide content in from the side, so an overflow counts only if it is still there once
      // they have had time to finish.
      let overflow = await findOverflow(page);
      for (let retry = 0; overflow && retry < 5; retry++) {
        await sleep(1_000);
        overflow = await findOverflow(page);
      }
      if (overflow) {
        errors.push(`${name} (${path}) at ${WIDTH}px: page ${overflow.scrollWidth}px wide; past the edge: ${overflow.culprits.join(', ') || 'none found'}`);
      } else {
        console.log(`  ok  ${name} (${path})`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (errors.length > 0) {
    console.error(`Mobile check failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log(`Nothing runs off the edge at ${WIDTH}px on ${picks.length} templates.`);
}

await main();
