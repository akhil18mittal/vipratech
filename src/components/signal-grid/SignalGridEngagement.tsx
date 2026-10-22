import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { ENGAGEMENT_STEPS } from "../../data/companyData";
import type { DiagnosticTriggerProps, NavLink } from "../../types";
import { SiteFooter } from "../site/SiteFooter";

export function SignalGridEngagement({
  onOpenDiagnostic,
  solutions,
}: DiagnosticTriggerProps & { solutions: NavLink[] }) {
  return (
    <>
      {/* Engagement Lifecycle */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono text-lime-400 uppercase tracking-widest font-bold">
              Engagement Lifecycle
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
              How We Work
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-md font-mono">
            Clear boundaries from the initial fit discussion through diagnostic sprint to full production deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ENGAGEMENT_STEPS.map((step) => (
            <motion.div
              key={step.step}
              whileHover={{ y: -4 }}
              className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl relative space-y-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold font-mono text-lime-400">
                  {step.step}
                </span>
                <span className="px-2.5 py-1 text-xs font-mono bg-zinc-800 text-zinc-300 rounded-md">
                  {step.duration}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {step.description}
              </p>

              <div className="pt-3 border-t border-zinc-800/80 text-xs font-mono text-lime-300 font-semibold">
                Cost Structure: {step.cost}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <SiteFooter
        solutions={solutions}
        callToAction={
          <button
            onClick={() => onOpenDiagnostic()}
            className="w-full py-3 px-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Schedule 20-Min Fit Call</span>
          </button>
        }
      />
    </>
  );
}
