import type { ContactLinks } from "../../types";
import { ContactButtons } from "../site/ContactButtons";

export function CtaBlock({ headline, text, contact }: { headline: string; text?: string; contact: ContactLinks }) {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200">
      <div className="p-8 sm:p-10 bg-slate-900 rounded-2xl text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{headline}</h2>
        {text && <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">{text}</p>}
        <div className="pt-4">
          <ContactButtons links={contact} location="cta" centered onDark />
        </div>
      </div>
    </section>
  );
}
