// GA4 events, also sent to Microsoft Clarity as custom events so recordings can be filtered by them. Nothing is sent
// until GA4_ID or CLARITY_ID is set in src/data/site.ts (ConsentScripts.astro only defines gtag and clarity then), and
// the visitor's consent decides what either tool may store.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

function track(event: string, params: Record<string, string | boolean>) {
  window.gtag?.('event', event, params);
  window.clarity?.('event', event);
}

/**
 * Sends cta_click for every element with data-cta (the audit, email, WhatsApp and booking buttons), and use_case_view
 * on use-case pages. The page type and slug come from data attributes on <body>, set by BaseLayout.
 */
export function trackPage() {
  const page = document.body.dataset;
  if (page.pageType === 'use-case') track('use_case_view', {slug: page.slug ?? ''});
  document.addEventListener('click', (event) => {
    const cta = (event.target as Element).closest<HTMLElement>('[data-cta]');
    if (!cta) return;
    track('cta_click', {
      cta: cta.dataset.cta ?? '',
      location: cta.dataset.ctaLocation ?? '',
      page_type: page.pageType ?? '',
      slug: page.slug ?? '',
    });
  });
}
