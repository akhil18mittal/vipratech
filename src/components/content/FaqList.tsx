import { ChevronDown } from "lucide-react";
import type { Faq } from "../../lib/seo";

/** FAQs as native <details>, so every answer is in the HTML (FAQPage markup needs that). */
export function FaqList({ faqs }: { faqs: readonly Faq[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <details
          key={faq.q}
          open={index === 0}
          className="group rounded-xl border border-slate-200 bg-white overflow-hidden open:border-teal-600"
        >
          <summary className="list-none [&::-webkit-details-marker]:hidden p-5 flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-base font-semibold text-slate-900">{faq.q}</span>
            <ChevronDown className="w-4 h-4 text-teal-700 transition-transform duration-300 flex-shrink-0 group-open:rotate-180" />
          </summary>
          <div className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>{faq.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
