import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, FileCheck } from "lucide-react";
import type { DiagnosticAnalysis, FitDiagnosticInput } from "../types";
import confetti from "canvas-confetti";
import { analyzeFitDiagnostic, buildFitCallMailto } from "../diagnostic/fitDiagnostic";

const DEFAULT_WORKFLOW = "Document Intelligence & Reconciliation";

interface FitDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

export const FitDiagnosticModal: React.FC<FitDiagnosticModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
}) => {
  const [workflowType, setWorkflowType] = useState(
    initialServiceId || DEFAULT_WORKFLOW
  );
  const [challenges, setChallenges] = useState<string[]>([
    "Unstructured PDFs and spreadsheet mismatches",
    "High manual review overhead & human errors",
  ]);
  const [currentWorkaround, setCurrentWorkaround] = useState("Manual spreadsheet mapping and team email chains");
  const [timeline, setTimeline] = useState("1-2 Months");
  const [teamSize, setTeamSize] = useState("10-50 People");

  const [analysis, setAnalysis] = useState<DiagnosticAnalysis | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setWorkflowType(initialServiceId || DEFAULT_WORKFLOW);
    setAnalysis(null);
  }, [initialServiceId, isOpen]);

  const diagnosticInput: FitDiagnosticInput = {
    workflowType,
    challenges,
    currentWorkaround,
    timeline,
    teamSize,
  };

  const toggleChallenge = (item: string) => {
    if (challenges.includes(item)) {
      setChallenges(challenges.filter((c) => c !== item));
    } else {
      setChallenges([...challenges, item]);
    }
  };

  const handleRunDiagnostic = () => {
    setAnalysis(null);
    const result = analyzeFitDiagnostic(diagnosticInput);
    setAnalysis(result);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-lime-500/10 border border-lime-500/30 rounded-xl text-lime-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tracking-widest text-lime-400 uppercase">
                  AI Fit Assessment Engine
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded-md">
                  VipraTech Diagnostic
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                Evaluate Workflow Automation Feasibility
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close fit diagnostic"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {!analysis ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Left */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    1. Target Workflow Area
                  </label>
                  <select
                    value={workflowType}
                    onChange={(e) => setWorkflowType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-lime-500 transition-colors"
                  >
                    <option value="Document Intelligence & Reconciliation">
                      Document Intelligence & Reconciliation
                    </option>
                    <option value="AI Security, Testing & Compliance">
                      AI Security & Agent Red-Teaming
                    </option>
                    <option value="Voice AI & Conversational Systems">
                      Multilingual Voice AI & Telephony
                    </option>
                    <option value="AI Sales & Revenue Automation">
                      Revenue & Outreach Automation
                    </option>
                    <option value="AI Product Research & Prototyping">
                      AI Product Discovery & Feasibility
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    2. Primary Pain Points / Challenges
                  </label>
                  <div className="space-y-2">
                    {[
                      "Unstructured PDFs and spreadsheet mismatches",
                      "High manual review overhead & human errors",
                      "AI agent security & compliance uncertainty",
                      "Multilingual / Hindi code-switching complexity",
                      "Lack of audit trail & decision evidence",
                      "Difficulty scaling repeated decisions",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleChallenge(item)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                          challenges.includes(item)
                            ? "bg-lime-500/10 border-lime-500/50 text-lime-300"
                            : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <span>{item}</span>
                        {challenges.includes(item) && (
                          <CheckCircle2 className="w-4 h-4 text-lime-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Right */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    3. Current Workaround
                  </label>
                  <textarea
                    rows={3}
                    value={currentWorkaround}
                    onChange={(e) => setCurrentWorkaround(e.target.value)}
                    placeholder="E.g. Spreadsheets, manual email validation, basic LLM wrapper without guardrails..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-lime-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      Expected Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-lime-500"
                    >
                      <option value="Urgent (1-2 Weeks)">Urgent (1-2 Weeks)</option>
                      <option value="1-2 Months">1-2 Months</option>
                      <option value="Q3/Q4 Roadmap">Q3/Q4 Roadmap</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      Team Size
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-lime-500"
                    >
                      <option value="1-10 People">1-10 People</option>
                      <option value="10-50 People">10-50 People</option>
                      <option value="50+ Enterprise">50+ Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-400 space-y-1">
                  <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-lime-400" />
                    VipraTech Guarantee
                  </div>
                  <p>
                    We evaluate your technical boundary first. If your problem is better solved deterministically or without AI, we will state so upfront.
                  </p>
                </div>

                <button
                  onClick={handleRunDiagnostic}
                  className="w-full py-3.5 px-4 bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-lime-500/10 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Evidence-Based Diagnostic
                </button>
              </div>
            </div>
          ) : (
            /* Analysis Result View */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Fit Summary Banner */}
              <div className="p-5 bg-zinc-900 border border-lime-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl bg-lime-500/10 border border-lime-500/40 flex items-center justify-center text-lime-400 font-mono text-2xl font-bold">
                    {analysis.fitScore}%
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-mono bg-lime-500/20 text-lime-300 border border-lime-500/40 rounded">
                        {analysis.fitStatus}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        Duration: {analysis.estimatedDurationDays}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      Recommended: {analysis.recommendedSprint}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-zinc-400 block">
                    Evidence Level
                  </span>
                  <span className="text-sm font-semibold text-lime-400">
                    {analysis.evidenceLevelToDeliver}
                  </span>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Architecture & Reason */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-mono text-lime-400 uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    Target System Architecture
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {analysis.recommendedArchitecture}
                  </p>
                  <p className="text-xs text-zinc-400 italic">
                    "{analysis.reasoning}"
                  </p>
                </div>

                {/* Key Risks */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Risks to De-Risk in Sprint
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {analysis.keyRisksIdentified.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-mono">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Deliverables */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Sprint Outputs Provided at Completion:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-200">
                  {analysis.sprintDeliverables.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-800/80 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-zinc-800">
                <button
                  onClick={() => setAnalysis(null)}
                  className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← Modify Diagnostic Inputs
                </button>

                <a
                  href={buildFitCallMailto(diagnosticInput, analysis)}
                  className="w-full sm:w-auto py-3 px-6 bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-lime-500/10 cursor-pointer"
                >
                  <span>Request Free 30-Min Fit Call</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
