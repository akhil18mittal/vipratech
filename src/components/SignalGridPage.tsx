import { Fragment, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  ArrowUpRight,
  Terminal,
  Sparkles,
  Zap,
  Radio,
  Eye,
  type LucideIcon,
} from "lucide-react";
import type { DiagnosticTriggerProps } from "../types";
import { InteractiveFeasibilitySimulator } from "./InteractiveFeasibilitySimulator";
import { DeRiskingCalculator } from "./DeRiskingCalculator";
import { FeasibilityFAQAccordion } from "./FeasibilityFAQAccordion";
import { MatrixRainCanvas } from "./MatrixRainCanvas";
import { MatrixTerminalHeadline } from "./MatrixTerminalHeadline";
import { SignalGridEngagement } from "./signal-grid/SignalGridEngagement";
import { SignalGridProducts } from "./signal-grid/SignalGridProducts";
import { SignalGridServices } from "./signal-grid/SignalGridServices";

const LIVE_LOGS = [
  { id: 1, type: "INGESTION", text: "PDF / Spreadsheet multi-parser", status: "PASSED", confidence: "100%", color: "text-lime-400" },
  { id: 2, type: "RULE ENGINE", text: "Deterministic math validation", status: "VERIFIED", confidence: "99.8%", color: "text-emerald-400" },
  { id: 3, type: "AMBIGUITY", text: "LLM Human Approval Gate", status: "PAUSED", confidence: "REQUIRES HUMAN", color: "text-amber-300" },
  { id: 4, type: "AUDIT LOG", text: "Durable settlement immutable record", status: "SETTLED", confidence: "100%", color: "text-teal-400" },
];

const TICKER_ITEMS: { text: string; icon: LucideIcon; pulse?: boolean }[] = [
  { text: "EVIDENCE-FIRST APPLIED AI", icon: Zap },
  { text: "DETERMINISTIC RULES + LLM JUDGMENT", icon: Radio, pulse: true },
  { text: "HUMAN REVIEW GATES", icon: Eye },
  { text: "AUTOSENTINX THREAT DEFENSE", icon: ShieldCheck },
  { text: "NO MOCK CLAIMS", icon: Zap },
];

const PROOF_METRICS = [
  { value: "100%", label: "Evidence Labeled" },
  { value: "5–10 Day", label: "De-Risk Sprints" },
  { value: "Human", label: "Approval Gates" },
];

export function SignalGridPage({ onOpenDiagnostic }: DiagnosticTriggerProps) {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [liveLogs, setLiveLogs] = useState(LIVE_LOGS);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLogs((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) {
          next.push({ ...first, id: Date.now() });
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-lime-400 selection:text-black relative overflow-hidden"
    >
      {/* Lime Cybernetic Signal Grid Matrix Rain Canvas */}
      <MatrixRainCanvas color="#a3e635" headColor="#ffffff" opacity={0.28} density={22} />
      {/* Tactical Target Reticle Cursor Follower */}
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: "spring", damping: 30, stiffness: 260 }}
        className="fixed top-0 left-0 -ml-[100px] -mt-[100px] w-[200px] h-[200px] pointer-events-none z-10 flex items-center justify-center hidden sm:flex"
      >
        {/* Glowing Radar Background */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(163,230,53,0.2)_0%,rgba(16,185,129,0.1)_50%,transparent_70%)] blur-sm" />

        {/* Outer Crosshair Ring */}
        <div className="w-28 h-28 border border-lime-400/50 rounded-full relative flex items-center justify-center">
          <div className="w-20 h-20 border border-dashed border-lime-300/70 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-lime-400 shadow-[0_0_10px_#a3e635]" />

          {/* Crosshair Compass Hash Lines */}
          <div className="absolute -top-2 w-px h-3 bg-lime-400" />
          <div className="absolute -bottom-2 w-px h-3 bg-lime-400" />
          <div className="absolute -left-2 h-px w-3 bg-lime-400" />
          <div className="absolute -right-2 h-px w-3 bg-lime-400" />
        </div>

        {/* Dynamic Telemetry HUD Tag */}
        <span className="absolute -bottom-6 text-[9px] font-mono font-bold text-lime-300 bg-zinc-900/90 border border-lime-500/50 px-2 py-0.5 rounded uppercase tracking-wider shadow-lg">
          TARGET_LOCK: ACTIVE
        </span>
      </motion.div>

      {/* Background Animated Scanlines & Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Floating Animated Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 1200,
              y: Math.random() * 800 + 100,
              opacity: 0.1,
              scale: Math.random() * 0.8 + 0.4,
            }}
            animate={{
              y: [null, -200],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-2 h-2 bg-lime-400/40 rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Moving Signal Rail Ticker */}
      <div className="w-full bg-lime-400 text-black py-2.5 overflow-hidden whitespace-nowrap font-mono text-xs font-bold tracking-widest uppercase border-b border-lime-500/50 sticky top-0 z-30 shadow-lg shadow-lime-400/10">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          className="inline-flex gap-10 items-center"
        >
          {TICKER_ITEMS.concat(TICKER_ITEMS.slice(0, 3)).map(({ text, icon: Icon, pulse }, index, items) => (
            <Fragment key={`${text}-${index}`}>
              <span className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${pulse ? "animate-pulse" : ""}`} />
                {text}
              </span>
              {index < items.length - 1 && <span>•</span>}
            </Fragment>
          ))}
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/40 text-lime-400 text-xs font-mono shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-ping" />
              <span>VIPRATECH LABS: KINETIC SIGNAL MATRIX</span>
            </div>

            <MatrixTerminalHeadline
              line1="Evidence-First"
              line2="Applied-AI Product Engineering"
              line1ClassName="text-white font-black"
              line2ClassName="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-teal-300 font-black"
              cursorColor="text-lime-400"
              speed={28}
              headlineClassName="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]"
            />

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              VipraTech Labs researches, prototypes, and builds production software for business-critical workflows where accuracy, evidence, human review, and operational reliability matter.
            </p>

            {/* Quick Proof Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-xl">
              {PROOF_METRICS.map((metric) => (
                <motion.div
                  key={metric.label}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl hover:border-lime-500/50 transition-all shadow-md"
                >
                  <span className="block text-xl font-black font-mono text-lime-400">{metric.value}</span>
                  <span className="text-[11px] text-zinc-400 uppercase font-mono mt-0.5 block">{metric.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenDiagnostic()}
                className="px-7 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl text-sm transition-all flex items-center gap-2.5 shadow-xl shadow-lime-400/25 cursor-pointer font-mono"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Fit Diagnostic</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="#services"
                className="px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 font-mono"
              >
                <span>Explore 5 Offers</span>
                <ArrowUpRight className="w-4 h-4 text-lime-400" />
              </motion.a>
            </div>
          </motion.div>

          {/* Hero Right: Living Signal Rail Matrix Widget */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="p-6 bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl relative overflow-hidden space-y-4 backdrop-blur-md">
              {/* Sweeping Laser Line Animation */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lime-400 to-transparent z-20 opacity-70 pointer-events-none shadow-[0_0_12px_#a3e635]"
              />

              {/* Rotating Crosshair Accent */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute top-4 right-4 w-9 h-9 border border-dashed border-lime-500/50 rounded-full flex items-center justify-center text-lime-400 text-xs font-mono pointer-events-none"
              >
                +
              </motion.div>

              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-lime-400" />
                  <span className="text-xs font-mono text-zinc-200 font-bold tracking-wide">
                    VIPRATECH_LIVE_SIGNAL.LOG
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                  <span className="text-[10px] font-mono text-lime-400 font-bold">LIVE STREAM</span>
                </div>
              </div>

              {/* Live Streaming Log Rows */}
              <div className="space-y-2 font-mono text-xs relative">
                <AnimatePresence mode="popLayout">
                  {liveLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-3 bg-zinc-950/90 border border-zinc-800/80 rounded-xl flex items-center justify-between text-zinc-300 hover:border-lime-500/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-zinc-500 font-bold block">
                          [{log.type}]
                        </span>
                        <span className="text-xs text-white font-medium">{log.text}</span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className={`text-[10px] font-bold block ${log.color}`}>{log.status}</span>
                        <span className="text-[9px] text-zinc-500">{log.confidence}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono border-t border-zinc-800">
                <span className="text-zinc-400">Governance: Rule + LLM + Human</span>
                <span className="text-lime-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                  ACTIVE PIPELINE
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SignalGridServices onOpenDiagnostic={onOpenDiagnostic} />

      <SignalGridProducts />

      {/* Interactive Governed AI Feasibility Simulator */}
      <InteractiveFeasibilitySimulator onOpenDiagnostic={onOpenDiagnostic} />

      {/* Interactive De-Risking ROI Calculator */}
      <DeRiskingCalculator onOpenDiagnostic={onOpenDiagnostic} />

      {/* Feasibility FAQ Accordion */}
      <FeasibilityFAQAccordion onOpenDiagnostic={onOpenDiagnostic} />

      <SignalGridEngagement onOpenDiagnostic={onOpenDiagnostic} />
    </div>
  );
}
