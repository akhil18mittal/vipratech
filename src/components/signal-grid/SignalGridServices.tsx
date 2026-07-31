import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  Cpu,
  FileSpreadsheet,
  Mic,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { DiagnosticTriggerProps } from "../../types";
import {
  EVIDENCE_LEVELS_EXPLANATION,
  SERVICE_OFFERS,
} from "../../data/companyData";

function getIcon(serviceId: string) {
  switch (serviceId) {
    case "doc-reconciliation":
      return <FileSpreadsheet className="w-5 h-5" />;
    case "ai-security":
      return <ShieldCheck className="w-5 h-5" />;
    case "voice-ai":
      return <Mic className="w-5 h-5" />;
    case "sales-automation":
      return <TrendingUp className="w-5 h-5" />;
    default:
      return <Cpu className="w-5 h-5" />;
  }
}

export function SignalGridServices({
  onOpenDiagnostic,
}: DiagnosticTriggerProps) {
  const [activeTab, setActiveTab] = useState(SERVICE_OFFERS[0].id);
  const selectedService =
    SERVICE_OFFERS.find((service) => service.id === activeTab) ??
    SERVICE_OFFERS[0];

  return (
    <>
      {/* Evidence Level Categorization Banner */}
      <section className="border-y border-zinc-800 bg-zinc-900/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
              Verification Policy
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Evidence Before Claims
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Every system and output is tagged according to what was mathematically verified vs researched.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {EVIDENCE_LEVELS_EXPLANATION.map((item) => (
              <motion.div
                key={item.level}
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-5 bg-zinc-900/90 border border-zinc-800 hover:border-lime-500/40 rounded-xl flex items-start gap-3.5 transition-all shadow-md"
              >
                <div className="p-2.5 rounded-lg bg-lime-400/10 border border-lime-400/30 text-lime-400 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">{item.level}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Offers Interactive Swiss Tabs */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono text-lime-400 uppercase tracking-widest font-bold">
              Core Capabilities & Services
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1">
              5 Core Applied-AI Offers
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-md font-mono">
            Engagements start with a 30-min fit call followed by a focused 5-10 day diagnostic sprint to eliminate risk before build.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-none border-b border-zinc-800">
          {SERVICE_OFFERS.map((service) => {
            const isActive = service.id === activeTab;
            return (
              <motion.button
                key={service.id}
                type="button"
                aria-pressed={isActive}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(service.id)}
                className={`px-4 py-3 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-lime-400 text-black shadow-lg shadow-lime-400/20"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                }`}
              >
                {getIcon(service.id)}
                <span>{service.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Service Offer Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-lime-400 font-bold uppercase">
                    Primary Offer: {selectedService.primaryOfferName}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {selectedService.title}
                  </h3>
                </div>
                <span className="px-3 py-1 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
                  Built/Deployed
                </span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {selectedService.description}
              </p>

              <div>
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3 font-bold">
                  Key Scope Components:
                </h4>
                <div className="space-y-2.5">
                  {selectedService.includedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2.5 text-xs text-zinc-200 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-950/80 border border-zinc-800/80 rounded-xl space-y-1.5 font-mono">
                <span className="text-xs text-zinc-400 uppercase block font-bold">
                  Target Audience:
                </span>
                <p className="text-xs text-zinc-300">
                  {selectedService.targetAudience}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenDiagnostic(selectedService.title)}
                className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-mono shadow-md shadow-lime-400/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Evaluate {selectedService.primaryOfferName} Feasibility</span>
              </motion.button>
            </div>

            {/* Right Sprint Outputs Card */}
            <div className="lg:col-span-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <Zap className="w-4 h-4 text-lime-400" />
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  Sprint Deliverables (5–10 Days)
                </h4>
              </div>

              <div className="space-y-3">
                {selectedService.sprintOutputs.map((output, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    className="p-3.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 flex items-center gap-3 transition-all"
                  >
                    <span className="w-6 h-6 rounded-md bg-lime-400/10 text-lime-400 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0 border border-lime-400/20">
                      0{index + 1}
                    </span>
                    <span className="font-medium">{output}</span>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-lime-500/10 border border-lime-500/20 rounded-xl text-xs text-zinc-300 space-y-1">
                <span className="text-lime-400 font-bold block font-mono">Fee Credit Guarantee:</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  If an implementation project is commissioned within 30 days of sprint completion, 50% of the diagnostic fee is credited directly toward that build.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  );
}
