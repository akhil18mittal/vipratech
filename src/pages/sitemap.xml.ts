import type {APIRoute} from 'astro';
import {USE_CASE_BATCHES} from '../data/release';
import {siteContent} from '../lib/collections';
import {linkFor} from '../lib/content';
import {absoluteUrl} from '../lib/seo';

// Every built, indexable page. A use-case page's lastmod is the day its batch went live; other pages change with each
// batch (new links and cards), so they take the latest release day. check:dist compares this list with the built pages.

export const GET: APIRoute = async () => {
  const {capabilities, industries, useCase} = await siteContent();
  const latest = USE_CASE_BATCHES.map((batch) => batch.releasedOn).sort().at(-1);
  const releasedOn = new Map(USE_CASE_BATCHES.flatMap((batch) => batch.industries.map((slug) => [slug, batch.releasedOn])));
  const useCasePages = industries.flatMap((industry) =>
    industry.use_cases.map(useCase).flatMap((item) => {
      const path = linkFor(item);
      return path ? [{path, lastmod: releasedOn.get(item.industry) ?? latest}] : [];
    }),
  );
  const pages = [
    ...['/', ...capabilities.map((item) => item.url), '/industries/', ...industries.map((item) => item.url), '/use-cases/'].map(
      (path) => ({path, lastmod: latest}),
    ),
    ...useCasePages,
    ...['/careers/', '/privacy/'].map((path) => ({path, lastmod: latest})),
  ];
  const urls = pages.map(({path, lastmod}) => `  <url><loc>${absoluteUrl(path)}</loc><lastmod>${lastmod}</lastmod></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, {headers: {'Content-Type': 'application/xml'}});
};
