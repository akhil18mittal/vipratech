import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Zap,
  FileSpreadsheet,
  Mic,
  ShieldAlert,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface SimulatorProps {
  onOpenDiagnostic: (serviceTitle?: string) => void;
}

export const InteractiveFeasibilitySimulator: React.FC<SimulatorProps> = ({
  onOpenDiagnostic,
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState("invoices");
  const [ruleStrictness, setRuleStrictness] = useState(85);
  const [llmThreshold, setLlmThreshold] = useState(90);
  const [humanGateThreshold, setHumanGateThreshold] = useState(75);
  const [isSimulating, setIsSimulating] = useState(false);

  const workflows = [
    {
      id: "invoices",
      title: "Distributor Invoices & Receipts",
      icon: FileSpreadsheet,
      desc: "Parsing multi-page PDFs, spreadsheets, and line items with strict price/QTY reconciliation.",
    },
    {
      id: "security",
      title: "AI Security Red-Teaming",
      icon: ShieldAlert,
      desc: "Simulating prompt injection, state corruption, and multi-turn adversarial agent exploits.",
    },
    {
      id: "voice",
      title: "Hindi/Hinglish Voice Automation",
      icon: Mic,
      desc: "Regulated debt collections & customer calls with real-time speech intent classification.",
    },
    {
      id: "revenue",
      title: "Sales & CRM Attribution",
      icon: TrendingUp,
      desc: "B2B prospect research, personalized outreach drafting, and human approval gates.",
    },
  ];

  const activeWf = workflows.find((w) => w.id === selectedWorkflow) || workflows[0];

  // Calculated simulation metrics
  const deterministicAutoPass = Math.round((ruleStrictness / 100) * 62);
  const llmProcessed = Math.round(((100 - deterministicAutoPass) * llmThreshold) / 100);
  const humanEscalated = Math.max(2, 100 - deterministicAutoPass - llmProcessed);
  const hallucinationBlockRate = Math.min(99.9, +(98.5 + (ruleStrictness * 0.015)).toFixed(1));

  const triggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1200);
  };

  const theme = {
    badge: "bg-lime-400/10 text-lime-400 border-lime-400/30",
    button: "bg-lime-400 text-black hover:bg-lime-300 shadow-lime-400/20",
    text: "text-lime-400",
    border: "border-lime-500/40",
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border ${theme.badge} mb-2`}>
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>INTERACTIVE SIMULATOR</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Governed AI Feasibility & Decision Matrix
          </h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-md font-mono">
          Adjust the deterministic rules and LLM evaluation thresholds below to see how our hybrid architecture eliminates hallucination risk in real-time.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Workflow Selector & Sliders */}
        <div className="lg:col-span-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-md">
          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-bold mb-3">
              1. Select Operational Workflow
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {workflows.map((wf) => {
                const isSelected = wf.id === selectedWorkflow;
                const WfIcon = wf.icon;
                return (
                  <button
                    key={wf.id}
                    onClick={() => {
                      setSelectedWorkflow(wf.id);
                      triggerSimulation();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? `bg-zinc-800 ${theme.border} text-white shadow-md`
                        : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <WfIcon className={`w-4 h-4 flex-shrink-0 ${isSelected ? theme.text : "text-zinc-500"}`} />
                    <span className="text-xs font-bold leading-tight line-clamp-1">{wf.title}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 font-mono">
              {activeWf.desc}
            </p>
          </div>

          <div className="space-y-4 pt-2 border-t border-zinc-800">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-bold">
              2. Tune Governance Parameters
            </label>

            {/* Slider 1: Deterministic Match Strictness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-300">Deterministic Rule Strictness</span>
                <span className={`font-bold ${theme.text}`}>{ruleStrictness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={ruleStrictness}
                onChange={(e) => {
                  setRuleStrictness(Number(e.target.value));
                  triggerSimulation();
                }}
                className="w-full accent-lime-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500 block font-mono">
                Calculates mathematical line item matches, tax calculations & regex schemas with 0% error.
              </span>
            </div>

            {/* Slider 2: LLM Confidence Cutoff */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-300">LLM Confidence Cutoff</span>
                <span className={`font-bold ${theme.text}`}>{llmThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                value={llmThreshold}
                onChange={(e) => {
                  setLlmThreshold(Number(e.target.value));
                  triggerSimulation();
                }}
                className="w-full accent-lime-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500 block font-mono">
                Requests explicit model citations & rationale before passing without review.
              </span>
            </div>

            {/* Slider 3: Human Review Escalation Trigger */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-300">Human Review Escalation Floor</span>
                <span className={`font-bold ${theme.text}`}>{humanGateThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={humanGateThreshold}
                onChange={(e) => {
                  setHumanGateThreshold(Number(e.target.value));
                  triggerSimulation();
                }}
                className="w-full accent-lime-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500 block font-mono">
                Escalates ambiguous or high-dollar items directly to human operator approval screens.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Animated Node Pipeline Visualization */}
        <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Sweeping laser scanner pulse */}
          {isSimulating && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-lime-400/20 to-transparent pointer-events-none z-20"
            />
          )}

          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${theme.text} animate-bounce`} />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Live Data Pipeline Node Simulation
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              100% REPRODUCIBLE
            </span>
          </div>

          {/* Node Flow Graphic */}
          <div className="space-y-3 font-mono">
            {/* Node 1: Ingestion */}
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <div>
                  <span className="text-xs text-white font-bold block">Heterogeneous Ingestion</span>
                  <span className="text-[10px] text-zinc-400">PDFs, CSVS, Speech Streams & DB Records</span>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-bold">100% Extracted</span>
            </div>

            {/* Connecting Arrow */}
            <div className="flex justify-center -my-1 text-zinc-600">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>

            {/* Node 2: Deterministic Rule Match */}
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <div>
                  <span className="text-xs text-white font-bold block">Deterministic Rule Engine</span>
                  <span className="text-[10px] text-zinc-400">Zero Hallucination Math & Schema Checks</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-bold block">{deterministicAutoPass}% Auto-Passed</span>
                <span className="text-[9px] text-zinc-500">0.00ms Latency</span>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="flex justify-center -my-1 text-zinc-600">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>

            {/* Node 3: LLM Model Judgment */}
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <div>
                  <span className="text-xs text-white font-bold block">LLM Ambiguity Resolution</span>
                  <span className="text-[10px] text-zinc-400">Contextual Reasoning with Citations</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-indigo-400 font-bold block">{llmProcessed}% Resolved</span>
                <span className="text-[9px] text-zinc-500">Evidence Labeled</span>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="flex justify-center -my-1 text-zinc-600">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>

            {/* Node 4: Human Review Gate */}
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <div>
                  <span className="text-xs text-white font-bold block">Human Approval Gate</span>
                  <span className="text-[10px] text-zinc-400">Operator Review for Edge Exceptions</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-400 font-bold block">{humanEscalated}% Escalated</span>
                <span className="text-[9px] text-zinc-500">Side-by-side UI</span>
              </div>
            </div>
          </div>

          {/* Outcome Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-800 font-mono">
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
              <span className="text-[10px] text-zinc-400 block uppercase">Hallucination Block</span>
              <span className={`text-base font-bold ${theme.text}`}>{hallucinationBlockRate}%</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
              <span className="text-[10px] text-zinc-400 block uppercase">Straight-Through Rate</span>
              <span className="text-base font-bold text-white">{deterministicAutoPass + llmProcessed}%</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-zinc-400 block uppercase">Audit Compliance</span>
              <span className="text-base font-bold text-emerald-400">100% Linked</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenDiagnostic(activeWf.title)}
            className={`w-full py-3.5 ${theme.button} font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-mono uppercase tracking-wider`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Validate This Pipeline For {activeWf.title}</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};
