import type {ContactLinks} from '../types';
import {COMPANY_INFO} from './companyData';

// Contact links for the call-to-action buttons on every page.

/** Replace CALENDLY_URL with the real 20-minute Calendly event to show "Book a 20-minute call" buttons. */
export const CALENDLY_PLACEHOLDER = 'https://calendly.com/vipratech-placeholder/20min';
const CALENDLY_URL: string = CALENDLY_PLACEHOLDER;

/** The page that explains the free claims audit and how to ask for one. */
export const AUDIT_PATH = '/free-claims-audit/';

const WHATSAPP_NUMBER = COMPANY_INFO.phone.replace(/\D/g, '');

/**
 * The booking page, tagged with the page the visitor booked from (Calendly passes UTM tags through to the booking).
 * Undefined while the booking URL is still the placeholder, so no button links to a page that doesn't exist.
 */
export function calendlyLink(pagePath: string, bookingUrl: string = CALENDLY_URL): string | undefined {
  if (bookingUrl === CALENDLY_PLACEHOLDER) return undefined;
  const url = new URL(bookingUrl);
  url.searchParams.set('utm_source', 'vipratech.in');
  url.searchParams.set('utm_medium', 'website');
  url.searchParams.set('utm_content', pagePath);
  return url.href;
}

/** A WhatsApp chat with the opening message filled in. */
export const whatsappLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** An email to request the free claims audit, with the details we need already listed. */
export const auditEmailLink = () => {
  const subject = 'Free claims audit request';
  const body = [
    'Hi Akhilesh,',
    '',
    'We would like a free claims audit.',
    '',
    'Company:',
    'My name and role:',
    'Number of distributors (approx.):',
    'Claim types we settle (schemes, damage, display, other):',
    'Phone or WhatsApp:',
  ].join('\n');
  return `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/** The buttons for a page: the free audit, WhatsApp opening with the page's topic, and booking when it is set up. */
export const contactLinks = (pagePath: string, topic: string): ContactLinks => ({
  primary: {href: AUDIT_PATH, label: 'Get a free claims audit', cta: 'audit'},
  whatsapp: whatsappLink(`Hi, I'm interested in ${topic}`),
  call: calendlyLink(pagePath),
});

/** The buttons on an early-access page, where the main button asks to become a design partner. */
export const earlyAccessLinks = (pagePath: string, title: string): ContactLinks => ({
  primary: {
    href: `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(`Early access: ${title}`)}`,
    label: 'Ask about early access',
    cta: 'early_access_email',
  },
  whatsapp: whatsappLink(`Hi, I'm interested in early access to ${title}`),
  call: calendlyLink(pagePath),
});

/** The buttons on the audit page itself, where the main button sends the request. */
export const auditRequestLinks = (): ContactLinks => ({
  primary: {href: auditEmailLink(), label: 'Request the audit by email', cta: 'audit_email'},
  whatsapp: whatsappLink("Hi, I'd like a free claims audit"),
  call: calendlyLink(AUDIT_PATH),
});

/** The GA4 Measurement ID ("G-…"). Until it is set, no analytics script loads and track() does nothing. */
export const GA4_ID: string | null = null;

/**
 * The day you approved the privacy policy at /privacy/ (e.g. '2026-11-02'). check:dist fails while it is null, so the
 * site can't go live with the draft policy.
 */
export const PRIVACY_POLICY_APPROVED_ON: string | null = '2026-10-23';

/** The default share image for social cards, 1200×630. */
export const SHARE_IMAGE = '/og/default.png';
