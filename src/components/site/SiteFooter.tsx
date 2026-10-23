import type { ReactNode } from "react";
import { Mail, Phone } from "lucide-react";
import { COMPANY_INFO } from "../../data/companyData";
import type { NavLink } from "../../types";

interface SiteFooterProps {
  solutions: NavLink[];
  /** The button under "Ready to de-risk AI?": the fit diagnostic on the homepage, the booking link elsewhere. */
  callToAction: ReactNode;
}

const PAGE_LINKS: NavLink[] = [
  { name: "Industries", href: "/industries/" },
  { name: "Use cases", href: "/use-cases/" },
  { name: "Careers", href: "/careers/" },
  { name: "Privacy", href: "/privacy/" },
];

const labelClass = "text-white font-bold block mb-2 uppercase tracking-wider text-[11px] font-mono";
const linkClass = "hover:text-lime-400 transition-colors";

export function SiteFooter({ solutions, callToAction }: SiteFooterProps) {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-4">
          <h3 className="text-xl font-bold text-white font-mono">
            {COMPANY_INFO.name}
          </h3>
          <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
            {COMPANY_INFO.subheading}
          </p>
          <div className="text-xs text-zinc-500 font-mono space-y-1">
            <p>Founder: {COMPANY_INFO.founder}</p>
            <p>Location: {COMPANY_INFO.address}</p>
          </div>
        </div>

        <div className="md:col-span-3 space-y-2 text-xs text-zinc-400 font-mono">
          <span className="text-white font-bold block mb-2 uppercase tracking-wider text-[11px]">
            Direct Contact
          </span>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-lime-400" />
            <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-lime-400 transition-colors">
              {COMPANY_INFO.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-lime-400" />
            <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-lime-400 transition-colors">
              {COMPANY_INFO.phone}
            </a>
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col justify-between">
          <div>
            <span className="text-white font-bold block mb-2 uppercase tracking-wider text-[11px] font-mono">
              Ready to de-risk AI?
            </span>
            {callToAction}
          </div>
          <div className="text-[11px] text-zinc-600 font-mono mt-4">
            © {new Date().getFullYear()} VipraTech Labs Private Limited.
          </div>
        </div>
      </div>

      <nav
        aria-label="Footer"
        className="max-w-7xl mx-auto mt-10 pt-6 border-t border-zinc-800/80 flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-xs text-zinc-400 font-mono"
      >
        <div>
          <span className={labelClass}>Solutions</span>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {solutions.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={linkClass}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {PAGE_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={linkClass}>
                {link.name}
              </a>
            </li>
          ))}
          <li data-cookie-settings className="hidden in-data-cookie-banner:block">
            <button type="button" className={linkClass}>
              Cookie settings
            </button>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
