import { ChevronDown, Menu, X } from "lucide-react";
import type { NavLink } from "../../types";

// Static header menu, above the homepage ticker and on every content page. The menus are native <details>, so every
// link is plain HTML; src/scripts/nav.ts closes them on outside click and Escape.

interface SiteHeaderProps {
  solutions: NavLink[];
  industries: NavLink[];
  callHref: string;
}

const summaryClass =
  "list-none [&::-webkit-details-marker]:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold text-zinc-300 hover:text-white cursor-pointer select-none";
const menuLinkClass =
  "block px-3 py-2 rounded-lg text-xs font-mono text-zinc-300 hover:text-lime-400 hover:bg-zinc-800/80 transition-colors";
const groupLabelClass = "text-xs font-mono text-lime-400 uppercase tracking-widest font-bold";

function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" className="w-7 h-7" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="#18181b" />
      <path d="M14 16h10l8 28 8-28h10L38 52H26L14 16Z" fill="#a3e635" />
    </svg>
  );
}

function DesktopMenu({ label, links, wide }: { label: string; links: NavLink[]; wide?: boolean }) {
  return (
    <details className="group relative" data-nav-menu>
      <summary className={summaryClass}>
        {label}
        <ChevronDown className="w-3.5 h-3.5 text-lime-400 transition-transform group-open:rotate-180" />
      </summary>
      <ul
        className={`absolute left-0 top-full mt-2 p-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl ${
          wide ? "w-[30rem] grid grid-cols-2" : "w-72"
        }`}
      >
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={menuLinkClass}>
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteHeader({ solutions, industries, callHref }: SiteHeaderProps) {
  return (
    <header className="relative z-40 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2.5 text-sm font-bold text-white font-mono tracking-wider">
          <LogoMark />
          <span>VIPRATECH LABS</span>
        </a>

        <nav aria-label="Main" className="hidden md:flex items-center gap-1">
          <DesktopMenu label="Solutions" links={solutions} />
          <DesktopMenu label="Industries" links={industries} wide />
          <a href="/use-cases/" className={summaryClass}>
            Use cases
          </a>
          <a
            href={callHref}
            target="_blank"
            rel="noopener"
            data-cta="calendly"
            data-cta-location="header"
            className="ml-3 px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl text-xs transition-all font-mono"
          >
            Book a 20-minute call
          </a>
        </nav>

        <details className="group md:hidden" data-nav-menu>
          <summary
            aria-label="Menu"
            className="list-none [&::-webkit-details-marker]:hidden p-2 rounded-lg border border-zinc-800 text-zinc-200 cursor-pointer"
          >
            <Menu className="w-5 h-5 group-open:hidden" />
            <X className="w-5 h-5 hidden group-open:block" />
          </summary>
          <nav
            aria-label="Main"
            className="absolute inset-x-0 top-full bg-zinc-950 border-b border-zinc-800 px-4 py-6 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl"
          >
            <div>
              <span className={groupLabelClass}>Solutions</span>
              <ul className="mt-2">
                {solutions.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={menuLinkClass}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className={groupLabelClass}>Industries</span>
              <ul className="mt-2 grid grid-cols-2">
                {industries.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={menuLinkClass}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <a href="/use-cases/" className={`${groupLabelClass} block`}>
              Use cases
            </a>
            <a
              href={callHref}
              target="_blank"
              rel="noopener"
              data-cta="calendly"
              data-cta-location="header"
              className="block w-full py-3 px-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl text-xs text-center font-mono"
            >
              Book a 20-minute call
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
