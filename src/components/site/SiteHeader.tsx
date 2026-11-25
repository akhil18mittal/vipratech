import { Menu, X } from "lucide-react";
import { AUDIT_PATH } from "../../data/site";
import type { NavLink } from "../../types";

// Static header on every page. The mobile menu is a native <details>, so every link is plain HTML; src/scripts/nav.ts
// closes it on outside click and Escape.

const NAV_LINKS: NavLink[] = [
  { name: "How it works", href: "/#how-it-works" },
  { name: "Use cases", href: "/use-cases/" },
  { name: "Sample report", href: "/sample-audit-report/" },
  { name: "Security", href: "/security/" },
];

const linkClass = "px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors";
const auditClass = "px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-sm transition-colors";

export function LogoMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="#0f766e" />
      <path d="M14 16h10l8 28 8-28h10L38 52H26L14 16Z" fill="#ffffff" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2.5 text-base font-bold text-slate-900">
          <LogoMark />
          <span>VipraTech</span>
        </a>

        <nav aria-label="Main" className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.name}
            </a>
          ))}
          <a href={AUDIT_PATH} data-cta="audit" data-cta-location="header" className={`ml-3 ${auditClass}`}>
            Get a free claims audit
          </a>
        </nav>

        <details className="group md:hidden" data-nav-menu>
          <summary
            aria-label="Menu"
            className="list-none [&::-webkit-details-marker]:hidden p-2 rounded-lg border border-slate-300 text-slate-700 cursor-pointer"
          >
            <Menu className="w-5 h-5 group-open:hidden" />
            <X className="w-5 h-5 hidden group-open:block" />
          </summary>
          <nav aria-label="Main" className="absolute inset-x-0 top-full bg-white border-b border-slate-200 px-4 py-4 space-y-1 shadow-lg">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={`block ${linkClass}`}>
                {link.name}
              </a>
            ))}
            <a href={AUDIT_PATH} data-cta="audit" data-cta-location="header" className={`block text-center mt-3 ${auditClass}`}>
              Get a free claims audit
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
