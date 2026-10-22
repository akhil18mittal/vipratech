import {describe, expect, it} from 'vitest';
import {CALENDLY_PLACEHOLDER, calendlyLink, whatsappLink} from '../src/data/site';

describe('contact links', () => {
  it('tags the booking link with the page it came from', () => {
    const url = new URL(calendlyLink('/industries/banking/'));
    expect(`${url.origin}${url.pathname}`).toBe(CALENDLY_PLACEHOLDER);
    expect(Object.fromEntries(url.searchParams)).toEqual({utm_source: 'vipratech.in', utm_medium: 'website', utm_content: '/industries/banking/'});
  });

  it('opens WhatsApp with the page title in the message', () => {
    const url = new URL(whatsappLink('Claims & fraud triage'));
    expect(url.origin + url.pathname).toBe('https://wa.me/917023415753');
    expect(url.searchParams.get('text')).toBe("Hi, I'm interested in Claims & fraud triage");
  });
});
