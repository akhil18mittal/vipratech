import type { ContactLinks } from "../../types";
import { ContactButtons } from "../site/ContactButtons";

export function CtaBlock({ headline, text, contact }: { headline: string; text?: string; contact: ContactLinks }) {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-zinc-800">
      <div className="p-8 sm:p-10 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-white">{headline}</h2>
        {text && <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl mx-auto">{text}</p>}
        <div className="pt-4">
          <ContactButtons links={contact} location="cta" centered />
        </div>
      </div>
    </section>
  );
}
