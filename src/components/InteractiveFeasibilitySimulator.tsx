import { Fragment, useState } from "react";
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
import type { DiagnosticTriggerProps } from "../types";
import { SERVICE_OFFERS } from "../data/companyData";
import { RangeControl } from "./RangeControl";

const WORKFLOWS = [
  {
    id: "invoices",
    serviceId: "doc-reconciliation",
    title: "Distributor Invoices & Receipts",
    icon: FileSpreadsheet,
    desc: "Parsing multi-page PDFs, spreadsheets, and line items with strict price/QTY reconciliation.",
  },
  {
    id: "security",
    serviceId: "ai-security",
    title: "AI Security Red-Teaming",
    icon: ShieldAlert,
    desc: "Simulating prompt injection, state corruption, and multi-turn adversarial agent exploits.",
  },
  {
    id: "voice",
    serviceId: "voice-ai",
    title: "Hindi/Hinglish Voice Automation",
    icon: Mic,
    desc: "Regulated debt collections & customer calls with real-time speech intent classification.",
  },
  {
    id: "revenue",
    serviceId: "sales-automation",
    title: "Sales & CRM Attribution",
    icon: TrendingUp,
    desc: "B2B prospect research, personalized outreach drafting, and human approval gates.",
  },
];

export function InteractiveFeasibilitySimulator({
  onOpenDiagnostic,
}: DiagnosticTriggerProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState("invoices");
  const [ruleStrictness, setRuleStrictness] = useState(85);
  const [llmThreshold, setLlmThreshold] = useState(90);
  const [humanGateThreshold, setHumanGateThreshold] = useState(75);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeWf = WORKFLOWS.find((workflow) => workflow.id === selectedWorkflow) ?? WORKFLOWS[0];
  const diagnosticWorkflow =
    SERVICE_OFFERS.find((service) => service.id === activeWf.serviceId)?.title ??
    SERVICE_OFFERS[0].title;

  // Calculated simulation metrics
  const deterministicAutoPass = Math.round((ruleStrictness / 100) * 62);
  const llmProcessed = Math.round(((100 - deterministicAutoPass) * llmThreshold) / 100);
  const humanEscalated = Math.max(2, 100 - deterministicAutoPass - llmProcessed);
  const hallucinationBlockRate = Math.min(99.9, +(98.5 + (ruleStrictness * 0.015)).toFixed(1));

  const triggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1200);
  };

  const pipelineNodes = [
    {
      step: "01",
      title: "Heterogeneous Ingestion",
      description: "PDFs, CSVS, Speech Streams & DB Records",
      badgeClass: "bg-zinc-800 text-zinc-300",
      value: "100% Extracted",
      valueClass: "text-emerald-400",
    },
    {
      step: "02",
      title: "Deterministic Rule Engine",
      description: "Zero Hallucination Math & Schema Checks",
      badgeClass: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
      value: `${deterministicAutoPass}% Auto-Passed`,
      valueClass: "text-emerald-400",
      detail: "0.00ms Latency",
    },
    {
      step: "03",
      title: "LLM Ambiguity Resolution",
      description: "Contextual Reasoning with Citations",
      badgeClass: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40",
      value: `${llmProcessed}% Resolved`,
      valueClass: "text-indigo-400",
      detail: "Evidence Labeled",
    },
    {
      step: "04",
      title: "Human Approval Gate",
      description: "Operator Review for Edge Exceptions",
      badgeClass: "bg-amber-500/20 text-amber-400 border border-amber-500/40",
      value: `${humanEscalated}% Escalated`,
      valueClass: "text-amber-400",
      detail: "Side-by-side UI",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border bg-lime-400/10 text-lime-400 border-lime-400/30 mb-2">
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
              {WORKFLOWS.map((wf) => {
                const isSelected = wf.id === selectedWorkflow;
                const WfIcon = wf.icon;
                return (
                  <button
                    key={wf.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedWorkflow(wf.id);
                      triggerSimulation();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? "bg-zinc-800 border-lime-500/40 text-white shadow-md"
                        : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <WfIcon className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-lime-400" : "text-zinc-500"}`} />
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

            <RangeControl
              label="Deterministic Rule Strictness"
              value={ruleStrictness}
              displayValue={`${ruleStrictness}%`}
              min={50}
              max={99}
              description="Calculates mathematical line item matches, tax calculations & regex schemas with 0% error."
              onChange={(value) => {
                setRuleStrictness(value);
                triggerSimulation();
              }}
            />
            <RangeControl
              label="LLM Confidence Cutoff"
              value={llmThreshold}
              displayValue={`${llmThreshold}%`}
              min={60}
              max={98}
              description="Requests explicit model citations & rationale before passing without review."
              onChange={(value) => {
                setLlmThreshold(value);
                triggerSimulation();
              }}
            />
            <RangeControl
              label="Human Review Escalation Floor"
              value={humanGateThreshold}
              displayValue={`${humanGateThreshold}%`}
              min={50}
              max={95}
              description="Escalates ambiguous or high-dollar items directly to human operator approval screens."
              onChange={(value) => {
                setHumanGateThreshold(value);
                triggerSimulation();
              }}
            />
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
              <Zap className="w-4 h-4 text-lime-400 animate-bounce" />
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
            {pipelineNodes.map((node, index) => (
              <Fragment key={node.step}>
                {index > 0 && (
                  <div className="flex justify-center -my-1 text-zinc-600">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>
                )}
                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${node.badgeClass}`}>
                      {node.step}
                    </div>
                    <div>
                      <span className="text-xs text-white font-bold block">{node.title}</span>
                      <span className="text-[10px] text-zinc-400">{node.description}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold ${node.detail ? "block" : ""} ${node.valueClass}`}>
                      {node.value}
                    </span>
                    {node.detail && <span className="text-[9px] text-zinc-500">{node.detail}</span>}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>

          {/* Outcome Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-800 font-mono">
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
              <span className="text-[10px] text-zinc-400 block uppercase">Hallucination Block</span>
              <span className="text-base font-bold text-lime-400">{hallucinationBlockRate}%</span>
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
            onClick={() => onOpenDiagnostic(diagnosticWorkflow)}
            className="w-full py-3.5 bg-lime-400 text-black hover:bg-lime-300 shadow-lime-400/20 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-mono uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            <span>Validate This Pipeline For {activeWf.title}</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
