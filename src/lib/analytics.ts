// GA4 events. Nothing is sent until GA4_ID is set in src/data/site.ts (ConsentScripts.astro only defines gtag then),
// and Consent Mode decides what GA4 may store for each visitor.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Record<string, string | boolean>) {
  window.gtag?.('event', event, params);
}

/**
 * Sends cta_click for every element with data-cta, and use_case_view on use-case pages. The page type, slug, industry
 * and capability come from data attributes on <body>, set by BaseLayout.
 */
export function trackPage() {
  const page = document.body.dataset;
  if (page.pageType === 'use-case') {
    track('use_case_view', {industry: page.industry ?? '', capability: page.capability ?? '', slug: page.slug ?? ''});
  }
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
