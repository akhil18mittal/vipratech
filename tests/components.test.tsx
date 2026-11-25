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
    const html = renderToStaticMarkup(<ContentCard item={{title: 'Scheme claims', text: 'Summary', href: '/use-cases/distributor-scheme-claims/'}} />);
    expect(html).toMatch(/^<a href="\/use-cases\/distributor-scheme-claims\/"/);
  });

  it('is plain text without a page to link to', () => {
    const html = renderToStaticMarkup(<ContentCard item={{title: 'Scheme claims', text: 'Summary'}} />);
    expect(tags(html, 'a')).toEqual([]);
    expect(html).toContain('Scheme claims</h3>');
  });

  it('shows the Featured pill only on featured cards', () => {
    expect(renderToStaticMarkup(<ContentCard item={{title: 'A', text: 'B', featured: true}} />)).toContain('Featured');
    expect(renderToStaticMarkup(<ContentCard item={{title: 'A', text: 'B'}} />)).not.toContain('Featured');
  });
});

describe('DiagramFigure', () => {
  const wide = {src: '/diagrams/distributor-scheme-claims-flow.svg', width: 1800, height: 400};
  const narrow = {src: '/diagrams/distributor-scheme-claims-flow-tb.svg', width: 320, height: 1100};
  const html = renderToStaticMarkup(<DiagramFigure title="Claims settlement" kind="workflow" diagram={wide} narrow={narrow} describedBy="workflow-steps" />);
  const [image] = tags(html, 'img');

  it('serves the top-to-bottom diagram on phones', () => {
    expect(tags(html, 'source')).toEqual([`<source media="(max-width: 639px)" srcSet="${narrow.src}" width="320" height="1100"/>`]);
    expect(image).toContain(`src="${wide.src}"`);
  });

  it('describes the diagram and points to its text version', () => {
    expect(image).toContain('alt="Claims settlement: workflow diagram"');
    expect(image).toContain('aria-describedby="workflow-steps"');
    expect(tags(html, 'div')[0]).toContain('aria-label="Claims settlement: workflow diagram"');
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
        {name: 'Use cases', path: '/use-cases/'},
        {name: 'Scheme claims', path: '/use-cases/distributor-scheme-claims/'},
      ]}
    />,
  );

  it('links every crumb but the current page', () => {
    expect(tags(html, 'a').map((tag) => tag.match(/href="([^"]*)"/)?.[1])).toEqual(['/', '/use-cases/']);
    expect(html).toMatch(/<span aria-current="page"[^>]*>Scheme claims<\/span>/);
  });
});

describe('ContactButtons', () => {
  const primary = {href: '/free-claims-audit/', label: 'Get a free claims audit', cta: 'audit'};
  const demo = {href: 'mailto:akhilesh@vipratech.in?subject=Demo', cta: 'demo_email'};
  const cta = (html: string) =>
    tags(html, 'a').map((tag) => [tag.match(/data-cta="([^"]*)"/)?.[1], tag.match(/data-cta-location="([^"]*)"/)?.[1]]);

  it('shows the main action, the demo and WhatsApp, tagged for the cta_click event', () => {
    const html = renderToStaticMarkup(<ContactButtons links={{primary, demo, whatsapp: 'https://wa.me/1'}} location="hero" />);
    expect(cta(html)).toEqual([
      ['audit', 'hero'],
      ['demo_email', 'hero'],
      ['whatsapp', 'hero'],
    ]);
    expect(html).toContain('Get a free claims audit');
    expect(html).toContain('Book a demo');
  });

  it('opens the booking page in a new tab once Calendly is set up', () => {
    const html = renderToStaticMarkup(
      <ContactButtons links={{primary, demo: {href: 'https://calendly.example/20min', cta: 'calendly'}, whatsapp: 'https://wa.me/1'}} location="cta" />,
    );
    expect(cta(html).map(([name]) => name)).toEqual(['audit', 'calendly', 'whatsapp']);
    expect(tags(html, 'a')[1]).toContain('target="_blank"');
  });

  it('opens an internal page in the same tab and an external one in a new tab', () => {
    const internal = renderToStaticMarkup(<ContactButtons links={{primary, demo, whatsapp: 'https://wa.me/1'}} location="hero" />);
    expect(tags(internal, 'a')[0]).not.toContain('target=');
    const external = renderToStaticMarkup(
      <ContactButtons links={{primary: {...primary, href: 'https://example.com/'}, demo, whatsapp: 'https://wa.me/1'}} location="hero" />,
    );
    expect(tags(external, 'a')[0]).toContain('target="_blank"');
  });
});

describe('engine design components', () => {
  it('draws each app screen as a numbered window with what it shows', async () => {
    const {AppScreens} = await import('../src/components/content/AppScreens');
    const html = renderToStaticMarkup(
      <AppScreens screens={[{name: 'Claims inbox', purpose: 'Every file received.', shows: ['Distributor and month', 'Read status', 'Totals']}]} />,
    );
    expect(html).toContain('vipratech / claims inbox');
    expect(tags(html, 'li')).toHaveLength(4);
  });

  it('numbers the decision rules and shows each exception code', async () => {
    const {ExceptionCodes, MatchRules} = await import('../src/components/content/EngineTables');
    expect(renderToStaticMarkup(<MatchRules rules={[{rule: 'Invoice exists', logic: 'Match on number and date.'}]} />)).toContain('R1');
    const codes = renderToStaticMarkup(<ExceptionCodes codes={[{code: 'NO_INVOICE', meaning: 'No invoice.', action: 'Ask for it.'}]} />);
    expect(codes).toContain('<code');
    expect(codes).toContain('NO_INVOICE');
  });
});
