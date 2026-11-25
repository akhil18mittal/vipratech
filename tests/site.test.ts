import {describe, expect, it} from 'vitest';
import {AUDIT_PATH, auditEmailLink, auditRequestLinks, calendlyLink, contactLinks, demoEmailLink, whatsappLink} from '../src/data/site';

describe('contact links', () => {
  it('asks for a demo by email while Calendly is still the placeholder', () => {
    expect(calendlyLink('/')).toBeUndefined();
    expect(contactLinks('/platform/', 'the VipraTech claims engine').demo).toEqual({
      href: demoEmailLink('the VipraTech claims engine'),
      cta: 'demo_email',
    });
  });

  it('tags the booking link with the page it came from once Calendly is set up', () => {
    const url = new URL(calendlyLink('/use-cases/distributor-scheme-claims/', 'https://calendly.com/vipratech/20min')!);
    expect(`${url.origin}${url.pathname}`).toBe('https://calendly.com/vipratech/20min');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      utm_source: 'vipratech.in',
      utm_medium: 'website',
      utm_content: '/use-cases/distributor-scheme-claims/',
    });
  });

  it('opens WhatsApp with the message filled in', () => {
    const url = new URL(whatsappLink("Hi, I'm interested in claims & deductions"));
    expect(url.origin + url.pathname).toBe('https://wa.me/917023415753');
    expect(url.searchParams.get('text')).toBe("Hi, I'm interested in claims & deductions");
  });

  it('sends every page to the free audit, except the audit page itself, which sends the request', () => {
    expect(contactLinks('/', 'x').primary).toEqual({href: AUDIT_PATH, label: 'Get a free claims audit', cta: 'audit'});
    expect(auditRequestLinks().primary.href).toBe(auditEmailLink());
  });

  it('prepares the audit request email', () => {
    const url = new URL(auditEmailLink());
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('akhilesh@vipratech.in');
    expect(url.searchParams.get('subject')).toBe('Free claims audit request');
    expect(url.searchParams.get('body')).toContain('Number of distributors');
  });

  it('prepares the demo request email for the page topic', () => {
    const url = new URL(demoEmailLink('Freight Bill Audit'));
    expect(url.searchParams.get('subject')).toBe('Demo request: Freight Bill Audit');
    expect(url.searchParams.get('body')).toContain('What we want to see');
  });
});
