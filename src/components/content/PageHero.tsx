import type { ContactLinks } from "../../types";
import { ContactButtons } from "../site/ContactButtons";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  intro?: string;
  contact?: ContactLinks;
}

export function PageHero({ eyebrow, title, subtitle, intro, contact }: PageHeroProps) {
  return (
    <section className="pt-8 pb-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/40 text-lime-400 text-xs font-mono">
          {eyebrow}
        </span>
      )}
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.08] text-white">{title}</h1>
      {subtitle && <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-3xl">{subtitle}</p>}
      {intro && <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">{intro}</p>}
      {contact && (
        <div className="pt-2">
          <ContactButtons links={contact} location="hero" />
        </div>
      )}
    </section>
  );
}
