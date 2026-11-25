import { MessageCircle, MonitorPlay } from "lucide-react";
import type { ContactLinks } from "../../types";

interface ContactButtonsProps {
  links: ContactLinks;
  /** Where on the page the buttons are, for the cta_click analytics event. */
  location: string;
  centered?: boolean;
  /** On a dark band the secondary buttons need light borders and text. */
  onDark?: boolean;
}

const base = "px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2";

export function ContactButtons({ links, location, centered, onDark }: ContactButtonsProps) {
  const secondary = onDark
    ? `${base} bg-transparent hover:bg-white/10 text-white border border-white/40`
    : `${base} bg-white hover:bg-slate-50 text-slate-800 border border-slate-300`;
  const external = links.primary.href.startsWith("http");
  return (
    <div className={`flex flex-wrap items-center gap-3 ${centered ? "justify-center" : ""}`}>
      <a
        href={links.primary.href}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
        data-cta={links.primary.cta}
        data-cta-location={location}
        className={`${base} ${onDark ? "bg-white hover:bg-teal-50 text-slate-900" : "bg-teal-700 hover:bg-teal-800 text-white"}`}
      >
        <span>{links.primary.label}</span>
      </a>
      <a
        href={links.demo.href}
        {...(links.demo.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
        data-cta={links.demo.cta}
        data-cta-location={location}
        className={secondary}
      >
        <MonitorPlay className="w-4 h-4" />
        <span>Book a demo</span>
      </a>
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener"
        data-cta="whatsapp"
        data-cta-location={location}
        className={secondary}
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp us</span>
      </a>
    </div>
  );
}
