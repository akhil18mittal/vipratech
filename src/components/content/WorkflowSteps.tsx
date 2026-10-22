/** Numbered rows in the homepage's sprint-deliverable style. */
export function WorkflowSteps({ id, steps }: { id?: string; steps: readonly { title?: string; detail: string }[] }) {
  return (
    <ol id={id} className="space-y-3 max-w-3xl">
      {steps.map((step, index) => (
        <li
          key={step.detail}
          className="p-3.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 flex items-start gap-3"
        >
          <span className="w-6 h-6 rounded-md bg-lime-400/10 text-lime-400 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0 border border-lime-400/20">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="space-y-1 pt-0.5">
            {step.title && <span className="block font-bold text-white">{step.title}</span>}
            <span className={`block ${step.title ? "text-zinc-400 leading-relaxed" : "font-medium"}`}>{step.detail}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
