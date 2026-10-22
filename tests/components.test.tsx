import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {ContentCard} from '../src/components/content/ContentCard';
import {DiagramFigure} from '../src/components/content/DiagramFigure';
import {FaqList} from '../src/components/content/FaqList';
import {Breadcrumbs} from '../src/components/site/Breadcrumbs';
import {ContactButtons} from '../src/components/site/ContactButtons';

/** The opening tags of every `tag` element in the markup. */
const tags = (html: string, tag: string) => html.match(new RegExp(`<${tag}\\b[^>]*>`, 'g')) ?? [];

describe('ContentCard', () => {
  it('links to a published page', () => {
    const html = renderToStaticMarkup(<ContentCard item={{title: 'Claims triage', text: 'Summary', href: '/use-cases/insurance/claims-triage/'}} />);
    expect(html).toMatch(/^<a href="\/use-cases\/insurance\/claims-triage\/"/);
  });

  it('is plain text for a page that is not published yet', () => {
    const html = renderToStaticMarkup(<ContentCard item={{title: 'Claims triage', text: 'Summary'}} />);
    expect(tags(html, 'a')).toEqual([]);
    expect(html).toContain('Claims triage</h3>');
  });

  it('shows the Featured pill only on featured cards', () => {
    expect(renderToStaticMarkup(<ContentCard item={{title: 'A', text: 'B', featured: true}} />)).toContain('Featured');
    expect(renderToStaticMarkup(<ContentCard item={{title: 'A', text: 'B'}} />)).not.toContain('Featured');
  });
});

describe('DiagramFigure', () => {
  const wide = {src: '/diagrams/banking/kyc-flow.svg', width: 1800, height: 400};
  const narrow = {src: '/diagrams/banking/kyc-flow-tb.svg', width: 320, height: 1100};
  const html = renderToStaticMarkup(<DiagramFigure title="KYC review" kind="workflow" diagram={wide} narrow={narrow} describedBy="workflow-steps" />);
  const [image] = tags(html, 'img');

  it('serves the top-to-bottom diagram on phones', () => {
    expect(tags(html, 'source')).toEqual([`<source media="(max-width: 639px)" srcSet="${narrow.src}" width="320" height="1100"/>`]);
    expect(image).toContain(`src="${wide.src}"`);
  });

  it('describes the diagram and points to its text version', () => {
    expect(image).toContain('alt="KYC review: workflow diagram"');
    expect(image).toContain('aria-describedby="workflow-steps"');
    expect(tags(html, 'div')[0]).toContain('aria-label="KYC review: workflow diagram"');
  });

  it('shrinks each version to 3/4 of its size at most, then scrolls', () => {
    expect(image).toContain('--diagram-min:1350px;--diagram-max:1800px;--diagram-min-narrow:240px;--diagram-max-narrow:320px');
  });

  it('links to the full-size diagram', () => {
    expect(html).toContain(`<a href="${wide.src}" target="_blank" rel="noopener"`);
    expect(html).toContain('Open full size</a></figcaption>');
  });
});

describe('FaqList', () => {
  const html = renderToStaticMarkup(
    <FaqList
      faqs={[
        {q: 'How long is a pilot?', a: 'Six to eight weeks.'},
        {q: 'Who owns the code?', a: 'You do.'},
      ]}
    />,
  );

  it('puts every answer in the HTML, with only the first one open', () => {
    expect(html).toContain('Six to eight weeks.');
    expect(html).toContain('You do.');
    expect(tags(html, 'details').map((tag) => tag.includes(' open=""'))).toEqual([true, false]);
  });
});

describe('Breadcrumbs', () => {
  const html = renderToStaticMarkup(
    <Breadcrumbs
      crumbs={[
        {name: 'Home', path: '/'},
        {name: 'Industries', path: '/industries/'},
        {name: 'Banking', path: '/industries/banking/'},
      ]}
    />,
  );

  it('links every crumb but the current page', () => {
    expect(tags(html, 'a').map((tag) => tag.match(/href="([^"]*)"/)?.[1])).toEqual(['/', '/industries/']);
    expect(html).toMatch(/<span aria-current="page"[^>]*>Banking<\/span>/);
  });
});

describe('ContactButtons', () => {
  const html = renderToStaticMarkup(<ContactButtons links={{call: 'https://calendly.example/20min', whatsapp: 'https://wa.me/1'}} location="hero" />);

  it('tags both buttons for the cta_click event', () => {
    expect(tags(html, 'a').map((tag) => [tag.match(/data-cta="([^"]*)"/)?.[1], tag.match(/data-cta-location="([^"]*)"/)?.[1]])).toEqual([
      ['calendly', 'hero'],
      ['whatsapp', 'hero'],
    ]);
    expect(html).toContain('Book a 20-minute call');
    expect(html).toContain('WhatsApp us');
  });
});
