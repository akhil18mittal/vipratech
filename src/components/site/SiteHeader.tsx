import { Menu, X } from "lucide-react";
import { AUDIT_PATH } from "../../data/site";
import type { NavLink } from "../../types";

// Static header on every page. The mobile menu is a native <details>, so every link is plain HTML; src/scripts/nav.ts
// closes it on outside click and Escape.

const NAV_LINKS: NavLink[] = [
  { name: "Platform", href: "/platform/" },
  { name: "Industries", href: "/industries/" },
  { name: "Use cases", href: "/use-cases/" },
  { name: "Sample report", href: "/sample-audit-report/" },
  { name: "Security", href: "/security/" },
];

const linkClass = "px-3 py-2 rounded-lg text-xs font-mono font-bold text-zinc-300 hover:text-white transition-colors";
const menuLinkClass =
  "block px-3 py-2 rounded-lg text-xs font-mono text-zinc-300 hover:text-lime-400 hover:bg-zinc-800/80 transition-colors";
const auditClass = "bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl text-xs transition-all font-mono";

export function LogoMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="#18181b" />
      <path d="M14 16h10l8 28 8-28h10L38 52H26L14 16Z" fill="#a3e635" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="relative z-40 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2.5 text-sm font-bold text-white font-mono tracking-wider">
          <LogoMark />
          <span>VIPRATECH LABS</span>
        </a>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.name}
            </a>
          ))}
          <a href={AUDIT_PATH} data-cta="audit" data-cta-location="header" className={`ml-3 px-4 py-2.5 ${auditClass}`}>
            Get a free claims audit
          </a>
        </nav>

        <details className="group lg:hidden" data-nav-menu>
          <summary
            aria-label="Menu"
            className="list-none [&::-webkit-details-marker]:hidden p-2 rounded-lg border border-zinc-800 text-zinc-200 cursor-pointer"
          >
            <Menu className="w-5 h-5 group-open:hidden" />
            <X className="w-5 h-5 hidden group-open:block" />
          </summary>
          <nav aria-label="Main" className="absolute inset-x-0 top-full bg-zinc-950 border-b border-zinc-800 px-4 py-6 space-y-1 shadow-2xl">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={menuLinkClass}>
                {link.name}
              </a>
            ))}
            <a href={AUDIT_PATH} data-cta="audit" data-cta-location="header" className={`block w-full mt-4 py-3 px-4 text-center ${auditClass}`}>
              Get a free claims audit
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
