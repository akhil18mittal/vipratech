import { CalendarDays } from "lucide-react";
import type { NavLink } from "../../types";
import { SiteFooter } from "./SiteFooter";

/** The site footer on content pages, where the button books a call (there is no fit diagnostic outside the homepage). */
export function ContentFooter({ solutions, callHref }: { solutions: NavLink[]; callHref: string }) {
  return (
    <SiteFooter
      solutions={solutions}
      callToAction={
        <a
          href={callHref}
          target="_blank"
          rel="noopener"
          data-cta="calendly"
          data-cta-location="footer"
          className="w-full py-3 px-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 font-mono"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Book a 20-minute call</span>
        </a>
      }
    />
  );
}
