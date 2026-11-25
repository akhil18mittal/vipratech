import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'astro/config';

export default defineConfig({
  site: 'https://vipratech.in',
  trailingSlash: 'always',
  integrations: [react()],
  // Pages from the old multi-industry site whose topic lives on: each is built as a small page that sends visitors on.
  // Every other retired address gets the 404 page, which points to the claims pages.
  redirects: {
    '/use-cases/retail-ecommerce/distributor-trade-claims-settlement/': '/use-cases/distributor-scheme-claims/',
    '/use-cases/retail-ecommerce/vendor-invoice-and-credit-note-reconciliation/': '/use-cases/credit-note-reconciliation/',
    '/industries/retail-ecommerce/': '/industries/d2c-brands/',
    '/industries/pharma-life-sciences/': '/industries/pharma-healthcare/',
    '/industries/automotive-mobility/': '/industries/auto-components-lubricants/',
    '/industries/agriculture/': '/industries/',
    '/industries/manufacturing/': '/industries/',
    '/solutions/document-intelligence/': '/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
