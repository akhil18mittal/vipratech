import type { UseCase } from "../../content/schema";
import { WorkflowSteps } from "./WorkflowSteps";

const labelClass = "text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3 font-bold block";

export function PilotBox({ pilot }: { pilot: UseCase["pilot"] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <p className="text-xs font-mono text-lime-400 font-bold uppercase">Duration: {pilot.duration}</p>
        <p className="text-sm text-zinc-300 leading-relaxed">{pilot.scope}</p>
        <div>
          <h3 className={labelClass}>Deliverables</h3>
          <WorkflowSteps steps={pilot.deliverables.map((detail) => ({ detail }))} />
        </div>
      </div>
      <div className="lg:col-span-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white font-mono uppercase border-b border-zinc-800 pb-3">What we measure</h3>
        <dl className="space-y-4">
          {pilot.what_we_measure.map((item) => (
            <div key={item.metric} className="space-y-1">
              <dt className="text-xs font-bold text-white">{item.metric}</dt>
              <dd className="text-xs text-zinc-400 leading-relaxed">{item.how}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
