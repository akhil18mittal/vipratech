import {COMPANY_INFO} from '../data/companyData';

// Structured data (JSON-LD) for search engines.

const SITE_URL = 'https://vipratech.in';

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;

export interface Crumb {
  name: string;
  path: string;
}

export interface Faq {
  q: string;
  a: string;
}

const context = 'https://schema.org';

export const breadcrumbJsonLd = (crumbs: readonly Crumb[]) => ({
  '@context': context,
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
});

export const faqJsonLd = (faqs: readonly Faq[]) => ({
  '@context': context,
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {'@type': 'Answer', text: faq.a},
  })),
});

export function organizationJsonLd() {
  // COMPANY_INFO.address reads "street…, city, state, country".
  const parts = COMPANY_INFO.address.split(', ');
  const [locality, region, country] = parts.slice(-3);
  return {
    '@context': context,
    '@type': 'Organization',
    name: COMPANY_INFO.name,
    url: `${SITE_URL}/`,
    logo: absoluteUrl('/logo.svg'),
    email: COMPANY_INFO.email,
    telephone: COMPANY_INFO.phone,
    founder: {'@type': 'Person', name: COMPANY_INFO.founder},
    address: {
      '@type': 'PostalAddress',
      streetAddress: parts.slice(0, -3).join(', '),
      addressLocality: locality,
      addressRegion: region,
      addressCountry: country,
    },
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so text can never close the script element. */
export const jsonLdText = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');
