import {describe, expect, it} from 'vitest';
import {AUDIT_PATH, auditEmailLink, auditRequestLinks, calendlyLink, contactLinks, earlyAccessLinks, whatsappLink} from '../src/data/site';

describe('contact links', () => {
  it('has no booking link while Calendly is still the placeholder', () => {
    expect(calendlyLink('/')).toBeUndefined();
    expect(contactLinks('/', 'a free claims audit').call).toBeUndefined();
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

  it('asks about early access by email on early-access pages', () => {
    const {primary} = earlyAccessLinks('/use-cases/quick-commerce-deductions/', 'Quick-Commerce Deductions');
    expect(new URL(primary.href).searchParams.get('subject')).toBe('Early access: Quick-Commerce Deductions');
    expect(primary.cta).toBe('early_access_email');
  });
});
