import { ArrowUpRight } from "lucide-react";
import type { CardItem } from "../../types";

/** A linked card, or a plain one when its page isn't published yet. */
export function ContentCard({ item }: { item: CardItem }) {
  const body = (
    <>
      {(item.label || item.featured) && (
        <span className="flex flex-wrap items-center gap-2">
          {item.featured && (
            <span className="px-2.5 py-0.5 text-[11px] font-mono bg-lime-400/10 text-lime-400 border border-lime-400/40 rounded-full font-bold">
              Featured
            </span>
          )}
          {item.label && <span className="text-xs font-mono text-zinc-400 font-bold uppercase">{item.label}</span>}
        </span>
      )}
      <h3 className="text-lg font-bold text-white flex items-start justify-between gap-3">
        {item.title}
        {item.href && <ArrowUpRight className="w-4 h-4 text-lime-400 flex-shrink-0 mt-1" />}
      </h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{item.text}</p>
    </>
  );
  const cardClass = "h-full p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-3 shadow-lg block";
  return item.href ? (
    <a href={item.href} className={`${cardClass} hover:border-lime-500/40 transition-colors`}>
      {body}
    </a>
  ) : (
    <div className={cardClass}>{body}</div>
  );
}
