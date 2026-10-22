import { ChevronDown } from "lucide-react";
import type { Faq } from "../../lib/seo";

/** The homepage FAQ accordion as native <details>, so every answer is in the HTML (FAQPage markup needs that). */
export function FaqList({ faqs }: { faqs: readonly Faq[] }) {
  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <details
          key={faq.q}
          open={index === 0}
          className="group rounded-2xl border transition-all overflow-hidden bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 open:bg-zinc-900 open:border-lime-500/60 open:shadow-xl open:shadow-lime-500/10"
        >
          <summary className="list-none [&::-webkit-details-marker]:hidden p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-3">
              <span className="text-lime-400 font-black text-xs">{String(index + 1).padStart(2, "0")}</span>
              {faq.q}
            </span>
            <ChevronDown className="w-4 h-4 text-lime-400 transition-transform duration-300 flex-shrink-0 group-open:rotate-180" />
          </summary>
          <div className="px-5 pb-6 sm:px-6 pt-0 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans border-t border-zinc-800/80">
            <p className="pt-4">{faq.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
