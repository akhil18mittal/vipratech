import type {ContactLinks} from '../types';
import {COMPANY_INFO} from './companyData';

// Contact links for the call-to-action buttons on every content page.

/** Replace with the real 20-minute Calendly event. check:dist fails while any page still links to the placeholder. */
export const CALENDLY_PLACEHOLDER = 'https://calendly.com/vipratech-placeholder/20min';
const CALENDLY_URL: string = CALENDLY_PLACEHOLDER;

const WHATSAPP_NUMBER = COMPANY_INFO.phone.replace(/\D/g, '');

/** The booking page, tagged with the page the visitor booked from (Calendly passes UTM tags through to the booking). */
export function calendlyLink(pagePath: string) {
  const url = new URL(CALENDLY_URL);
  url.searchParams.set('utm_source', 'vipratech.in');
  url.searchParams.set('utm_medium', 'website');
  url.searchParams.set('utm_content', pagePath);
  return url.href;
}

/** A WhatsApp chat with the opening message filled in. */
export const whatsappLink = (pageTitle: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I'm interested in ${pageTitle}`)}`;

/** Both buttons for a page: the booking link tagged with its address, and WhatsApp opening with its title. */
export const contactLinks = (pagePath: string, pageTitle: string): ContactLinks => ({
  call: calendlyLink(pagePath),
  whatsapp: whatsappLink(pageTitle),
});

/** The GA4 Measurement ID ("G-…"). Until it is set, no analytics script loads and track() does nothing. */
export const GA4_ID: string | null = null;

/**
 * The consent banner script's src from the consent service's install snippet (CookieYes:
 * 'https://cdn-cookieyes.com/client_data/<key>/script.js'). It loads only for visitors whose time zone is in Europe;
 * Consent Mode's region defaults keep EEA/UK/CH visitors denied until they accept, banner or not.
 */
export const CONSENT_SCRIPT_SRC: string | null = null;

/**
 * The day you approved the privacy policy at /privacy/ (e.g. '2026-11-02'). check:dist fails while it is null, so the
 * site can't go live with the draft policy.
 */
export const PRIVACY_POLICY_APPROVED_ON: string | null = null;

/** The default share image for social cards, 1200×630. */
export const SHARE_IMAGE = '/og/default.png';
