import type {APIRoute} from 'astro';
import {AUDIT_PATH} from '../data/site';
import {siteContent} from '../lib/collections';
import {absoluteUrl} from '../lib/seo';

// Every built, indexable page. check:dist compares this list with the built pages.

export const GET: APIRoute = async () => {
  const {useCases} = await siteContent();
  const paths = [
    '/',
    AUDIT_PATH,
    '/sample-audit-report/',
    '/use-cases/',
    ...useCases.map((useCase) => useCase.url),
    '/security/',
    '/privacy/',
  ];
  const urls = paths.map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, {headers: {'Content-Type': 'application/xml'}});
};
