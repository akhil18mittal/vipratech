import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import type { DiagnosticTriggerProps } from "../types";

const FAQS = [
    {
      q: "What makes VipraTech Labs different from typical AI wrappers?",
      a: "Typical wrappers pass unvalidated prompts straight to APIs and hope for the best. VipraTech builds hybrid systems where deterministic rules run first to guarantee 0% error on known logic, followed by LLM model judgment with explicit citation mapping, and a dedicated side-by-side human approval gate before any settlement or dispatch occurs.",
    },
    {
      q: "What is a 5–10 Day Diagnostic Sprint and what does it deliver?",
      a: "Before asking for a large engineering contract, we de-risk your workflow in 5 to 10 business days. You receive a complete workflow & exception map, an error/leakage taxonomy, reference architecture specifications, bounded pilot scope, and verified technical feasibility tests on your sample data.",
    },
    {
      q: "How does the 50% Diagnostic Fee Credit work?",
      a: "If your organization commissions a production implementation build with VipraTech within 30 days of completing the Diagnostic Sprint, 50% of the diagnostic sprint fee is credited directly toward your implementation contract.",
    },
    {
      q: "How do you handle strict data privacy, NDAs, and enterprise IP?",
      a: "We work under strict mutual non-disclosure agreements (NDAs). Customer data, private document stores, trade secrets, and currency figures are strictly isolated in your cloud environment or dedicated single-tenant pipelines. We never use client data to train public models.",
    },
    {
      q: "Can VipraTech integrate with our legacy ERP, CRM, or telephony systems?",
      a: "Yes. Our team has built integrations across heterogeneous REST APIs, PostgreSQL databases, Salesforce/HubSpot CRMs, Twilio/Exotel telephony, custom webhook architectures, and flat file/S3 storage buckets.",
    },
];

export function FeasibilityFAQAccordion({ onOpenDiagnostic }: DiagnosticTriggerProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-zinc-800/80">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-lime-400/10 text-lime-400 border border-lime-400/30 mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FEASIBILITY FAQ</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-zinc-400 mt-2 font-mono">
          Clear answers about our evidence-first engineering methodology, diagnostic sprints, and security guarantees.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.q}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? "bg-zinc-900 border-lime-500/60 shadow-xl shadow-lime-500/10"
                  : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-3">
                  <span className="text-lime-400 font-black text-xs">0{index + 1}</span>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-lime-400 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 sm:px-6 pt-0 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans border-t border-zinc-800/80">
                      <p className="pt-4">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Callout Box */}
      <div className="mt-12 p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-sm font-bold text-white font-mono">Have a specific custom workflow question?</h3>
          <p className="text-xs text-zinc-400 mt-1">Schedule a 30-minute free fit call with our founder & engineering leads.</p>
        </div>
        <button
          onClick={() => onOpenDiagnostic()}
          className="px-6 py-3 bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs rounded-xl transition-all cursor-pointer font-mono flex items-center gap-2 whitespace-nowrap shadow-lg shadow-lime-400/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Schedule 30-Min Fit Call</span>
        </button>
      </div>
    </section>
  );
}
