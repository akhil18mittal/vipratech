import { MessageCircle, MonitorPlay } from "lucide-react";
import type { ContactLinks } from "../../types";

interface ContactButtonsProps {
  links: ContactLinks;
  /** Where on the page the buttons are, for the cta_click analytics event. */
  location: string;
  centered?: boolean;
}

const secondary =
  "px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 font-mono";
const newTab = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {});

export function ContactButtons({ links, location, centered }: ContactButtonsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${centered ? "justify-center" : ""}`}>
      <a
        href={links.primary.href}
        {...newTab(links.primary.href)}
        data-cta={links.primary.cta}
        data-cta-location={location}
        className="px-7 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl text-sm transition-all flex items-center gap-2.5 shadow-xl shadow-lime-400/25 font-mono"
      >
        <span>{links.primary.label}</span>
      </a>
      <a href={links.demo.href} {...newTab(links.demo.href)} data-cta={links.demo.cta} data-cta-location={location} className={secondary}>
        <MonitorPlay className="w-4 h-4 text-lime-400" />
        <span>Book a demo</span>
      </a>
      <a href={links.whatsapp} target="_blank" rel="noopener" data-cta="whatsapp" data-cta-location={location} className={secondary}>
        <MessageCircle className="w-4 h-4 text-lime-400" />
        <span>WhatsApp us</span>
      </a>
    </div>
  );
}
