import {describe, expect, it} from 'vitest';
import {breadcrumbJsonLd, faqJsonLd, jsonLdText, organizationJsonLd} from '../src/lib/seo';

describe('structured data', () => {
  it('numbers breadcrumbs from 1 with absolute URLs', () => {
    const list = breadcrumbJsonLd([
      {name: 'Home', path: '/'},
      {name: 'Industries', path: '/industries/'},
    ]);
    expect(list.itemListElement).toEqual([
      {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://vipratech.in/'},
      {'@type': 'ListItem', position: 2, name: 'Industries', item: 'https://vipratech.in/industries/'},
    ]);
  });

  it('marks up each FAQ as a question with its answer', () => {
    expect(faqJsonLd([{q: 'Who owns the code?', a: 'You do.'}]).mainEntity).toEqual([
      {'@type': 'Question', name: 'Who owns the code?', acceptedAnswer: {'@type': 'Answer', text: 'You do.'}},
    ]);
  });

  it('splits the company address into its parts', () => {
    expect(organizationJsonLd().address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: 'Plot No. 1, Vikas Nagar, Nanta Road, Kunhari',
      addressLocality: 'Kota',
      addressRegion: 'Rajasthan',
      addressCountry: 'India',
    });
  });

  it('cannot close its script element, whatever the text', () => {
    const text = jsonLdText({name: '</script><script>alert(1)</script>'});
    expect(text).not.toContain('<');
    expect(JSON.parse(text)).toEqual({name: '</script><script>alert(1)</script>'});
  });
});
