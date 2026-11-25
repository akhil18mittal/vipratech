import { ArrowUpRight } from "lucide-react";
import type { CardItem } from "../../types";

/** A linked card, or a plain one when it has no page. */
export function ContentCard({ item }: { item: CardItem }) {
  const body = (
    <>
      {(item.label || item.featured) && (
        <span className="flex flex-wrap items-center gap-2">
          {item.featured && (
            <span className="px-2.5 py-0.5 text-xs bg-teal-50 text-teal-800 border border-teal-200 rounded-full font-semibold">
              Featured
            </span>
          )}
          {item.label && <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{item.label}</span>}
        </span>
      )}
      <h3 className="text-lg font-bold text-slate-900 flex items-start justify-between gap-3">
        {item.title}
        {item.href && <ArrowUpRight className="w-4 h-4 text-teal-700 flex-shrink-0 mt-1" />}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
    </>
  );
  const cardClass = "h-full p-6 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm block";
  return item.href ? (
    <a href={item.href} className={`${cardClass} hover:border-teal-600 transition-colors`}>
      {body}
    </a>
  ) : (
    <div className={cardClass}>{body}</div>
  );
}
