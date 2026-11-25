import type { UseCase } from "../../content/schema";
import { WorkflowSteps } from "./WorkflowSteps";

const labelClass = "text-xs text-slate-500 uppercase tracking-wide mb-3 font-semibold block";

/** How a use case goes live: the first two cycles run beside the current process, then finance switches over. */
export function RolloutBox({ rollout }: { rollout: UseCase["rollout"] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <p className="text-sm text-teal-800 font-semibold">Time to go live: {rollout.duration}</p>
        <p className="text-base text-slate-600 leading-relaxed">{rollout.scope}</p>
        <div>
          <h3 className={labelClass}>Deliverables</h3>
          <WorkflowSteps steps={rollout.deliverables.map((detail) => ({ detail }))} />
        </div>
      </div>
      <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-3">What we measure</h3>
        <dl className="space-y-4">
          {rollout.what_we_measure.map((item) => (
            <div key={item.metric} className="space-y-1">
              <dt className="text-sm font-semibold text-slate-900">{item.metric}</dt>
              <dd className="text-sm text-slate-600 leading-relaxed">{item.how}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
