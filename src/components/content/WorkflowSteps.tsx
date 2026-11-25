/** Numbered rows: a workflow's steps, a pilot's deliverables. */
export function WorkflowSteps({ id, steps }: { id?: string; steps: readonly { title?: string; detail: string }[] }) {
  return (
    <ol id={id} className="space-y-3 max-w-3xl">
      {steps.map((step, index) => (
        <li key={step.detail} className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 flex items-start gap-3">
          <span className="w-7 h-7 rounded-full bg-teal-700 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
            {index + 1}
          </span>
          <span className="space-y-1 pt-0.5">
            {step.title && <span className="block font-semibold text-slate-900">{step.title}</span>}
            <span className="block leading-relaxed">{step.detail}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
