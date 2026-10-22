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
