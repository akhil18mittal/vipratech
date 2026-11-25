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
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          {eyebrow}
        </span>
      )}
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-slate-900">{title}</h1>
      {subtitle && <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">{subtitle}</p>}
      {intro && <p className="text-base text-slate-600 leading-relaxed max-w-3xl">{intro}</p>}
      {contact && (
        <div className="pt-2">
          <ContactButtons links={contact} location="hero" />
        </div>
      )}
    </section>
  );
}
