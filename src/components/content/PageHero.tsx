import type { ContactLinks, NavLink } from "../../types";
import { ContactButtons } from "../site/ContactButtons";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  intro?: string;
  /** Labelled links under the title, e.g. a use case's capability and industry. */
  facts?: { label: string; links: NavLink[] }[];
  contact?: ContactLinks;
}

export function PageHero({ eyebrow, title, subtitle, intro, facts, contact }: PageHeroProps) {
  return (
    <section className="pt-8 pb-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/40 text-lime-400 text-xs font-mono">
          {eyebrow}
        </span>
      )}
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.08] text-white">{title}</h1>
      {subtitle && <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-3xl">{subtitle}</p>}
      {facts && (
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-wrap gap-x-2">
              <dt className="text-zinc-400 font-bold">{fact.label}:</dt>
              {fact.links.map((link, index) => (
                <dd key={link.href}>
                  <a href={link.href} className="text-lime-400 hover:text-lime-300 transition-colors">
                    {link.name}
                  </a>
                  {index < fact.links.length - 1 && <span className="text-zinc-500">,</span>}
                </dd>
              ))}
            </div>
          ))}
        </dl>
      )}
      {intro && <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">{intro}</p>}
      {contact && (
        <div className="pt-2">
          <ContactButtons links={contact} location="hero" />
        </div>
      )}
    </section>
  );
}
