import { Mail, MessageCircle, Phone } from "lucide-react";
import { COMPANY_INFO } from "../../data/companyData";
import { AUDIT_PATH, whatsappLink } from "../../data/site";
import type { NavLink } from "../../types";
import { LogoMark } from "./SiteHeader";

const PAGE_LINKS: NavLink[] = [
  { name: "Free claims audit", href: AUDIT_PATH },
  { name: "Use cases", href: "/use-cases/" },
  { name: "Sample report", href: "/sample-audit-report/" },
  { name: "Security", href: "/security/" },
  { name: "Privacy", href: "/privacy/" },
];

const labelClass = "text-slate-900 font-semibold block mb-3 text-sm";
const linkClass = "hover:text-teal-700 transition-colors";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 text-sm text-slate-600">
        <div className="md:col-span-5 space-y-3">
          <a href="/" className="flex items-center gap-2.5 text-base font-bold text-slate-900">
            <LogoMark />
            <span>VipraTech</span>
          </a>
          <p className="max-w-md leading-relaxed">{COMPANY_INFO.subheading}</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            {COMPANY_INFO.name}
            <br />
            {COMPANY_INFO.address}
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <span className={labelClass}>Pages</span>
          <ul className="space-y-2">
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

        <div className="md:col-span-4 space-y-2">
          <span className={labelClass}>Talk to {COMPANY_INFO.founder}</span>
          <a href={`mailto:${COMPANY_INFO.email}`} className={`flex items-center gap-2 ${linkClass}`}>
            <Mail className="w-4 h-4 text-teal-700" />
            {COMPANY_INFO.email}
          </a>
          <a href={`tel:${COMPANY_INFO.phone.replace(/\s/g, "")}`} className={`flex items-center gap-2 ${linkClass}`}>
            <Phone className="w-4 h-4 text-teal-700" />
            {COMPANY_INFO.phone}
          </a>
          <a
            href={whatsappLink("Hi, I'm interested in VipraTech's claims reconciliation")}
            target="_blank"
            rel="noopener"
            data-cta="whatsapp"
            data-cta-location="footer"
            className={`flex items-center gap-2 ${linkClass}`}
          >
            <MessageCircle className="w-4 h-4 text-teal-700" />
            WhatsApp
          </a>
        </div>
      </div>
      <p className="max-w-5xl mx-auto mt-10 pt-6 border-t border-slate-200 text-xs text-slate-500">
        © {new Date().getFullYear()} {COMPANY_INFO.name}
      </p>
    </footer>
  );
}
