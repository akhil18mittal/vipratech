import React, { useState } from "react";
import { motion } from "motion/react";
import { Calculator, Sparkles } from "lucide-react";

interface CalculatorProps {
  onOpenDiagnostic: (serviceTitle?: string) => void;
}

export const DeRiskingCalculator: React.FC<CalculatorProps> = ({
  onOpenDiagnostic,
}) => {
  const [monthlyVolume, setMonthlyVolume] = useState(2500); // Documents, Calls, or Leads
  const [reviewTimePerItem, setReviewTimePerItem] = useState(12); // Minutes spent manually
  const [hourlyOperatorCost, setHourlyOperatorCost] = useState(35); // USD or equivalent / hr
  const [targetAutomation, setTargetAutomation] = useState(82); // % automated

  // Math calculations
  const currentTotalHoursMonth = Math.round((monthlyVolume * reviewTimePerItem) / 60);
  const hoursSavedMonth = Math.round((currentTotalHoursMonth * targetAutomation) / 100);
  const dollarsSavedMonth = Math.round(hoursSavedMonth * hourlyOperatorCost);
  const annualSavings = dollarsSavedMonth * 12;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-lime-400/10 text-lime-400 border border-lime-400/30 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>FINANCIAL DE-RISKING CALCULATOR</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Calculate Your Applied AI ROI
          </h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-md font-mono">
          50% of your 5–10 day Diagnostic Sprint fee is credited directly toward full implementation if commissioned within 30 days.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Input Controls */}
        <div className="lg:col-span-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
          <h3 className="text-sm font-mono text-zinc-300 uppercase tracking-wider font-bold border-b border-zinc-800 pb-3">
            Operational Volume & Cost Inputs
          </h3>

          {/* Input 1: Monthly Document / Call Volume */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-300">Monthly Volume (Invoices / Calls / Records)</span>
              <span className="font-bold text-lime-400">{monthlyVolume.toLocaleString()} items/mo</span>
            </div>
            <input
              type="range"
              min="200"
              max="25000"
              step="100"
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(Number(e.target.value))}
              className="w-full accent-lime-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Input 2: Minutes Spent Per Exception Item */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-300">Manual Time Per Exception Item</span>
              <span className="font-bold text-lime-400">{reviewTimePerItem} minutes</span>
            </div>
            <input
              type="range"
              min="2"
              max="45"
              value={reviewTimePerItem}
              onChange={(e) => setReviewTimePerItem(Number(e.target.value))}
              className="w-full accent-lime-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Input 3: Fully Burdened Hourly Cost */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-300">Blended Operator Hourly Rate</span>
              <span className="font-bold text-lime-400">${hourlyOperatorCost}/hr</span>
            </div>
            <input
              type="range"
              min="15"
              max="150"
              step="5"
              value={hourlyOperatorCost}
              onChange={(e) => setHourlyOperatorCost(Number(e.target.value))}
              className="w-full accent-lime-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Input 4: Target Automation Percentage */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-300">Target Straight-Through Automation</span>
              <span className="font-bold text-lime-400">{targetAutomation}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={targetAutomation}
              onChange={(e) => setTargetAutomation(Number(e.target.value))}
              className="w-full accent-lime-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Output Metrics Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-lime-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-mono text-lime-400 font-bold uppercase tracking-wider">
              Projected Annual Impact
            </span>
            <span className="px-2.5 py-1 text-[10px] font-mono bg-lime-400/10 text-lime-400 border border-lime-400/30 rounded-full font-bold">
              50% SPRINT CREDIT ELIGIBLE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950/90 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[11px] text-zinc-400 font-mono uppercase block">Monthly Hours Reclaimed</span>
              <span className="text-2xl sm:text-3xl font-black text-lime-400 font-mono">
                {hoursSavedMonth.toLocaleString()} hrs
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">From manual exception handling</span>
            </div>

            <div className="p-4 bg-zinc-950/90 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[11px] text-zinc-400 font-mono uppercase block">Monthly Cost Recovered</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                ${dollarsSavedMonth.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">Direct operational savings</span>
            </div>
          </div>

          {/* Big Annualized Box */}
          <div className="p-5 bg-lime-400/10 border border-lime-400/40 rounded-xl text-center space-y-1 shadow-lg">
            <span className="text-xs font-mono text-lime-300 font-bold uppercase tracking-wider block">
              Estimated 12-Month Net Return
            </span>
            <span className="text-3xl sm:text-4xl font-black text-lime-400 font-mono block">
              ${annualSavings.toLocaleString()} / year
            </span>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto pt-1 font-mono">
              Proven in 5–10 business days before full software investment.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenDiagnostic()}
            className="w-full py-4 bg-lime-400 hover:bg-lime-300 text-black font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-mono uppercase tracking-wider shadow-xl shadow-lime-400/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lock In Diagnostic Sprint Scope & Fee Credit</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};
