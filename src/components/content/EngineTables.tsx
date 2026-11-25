// The decision engine's design for one use case: the checks it runs, the reasons it holds a line, and the records it
// keeps. Lists rather than tables, so they read on a phone without scrolling sideways.

export function MatchRules({ rules }: { rules: readonly { rule: string; logic: string }[] }) {
  return (
    <ol className="space-y-3">
      {rules.map((item, index) => (
        <li key={item.rule} className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-xl flex flex-col sm:flex-row gap-2 sm:gap-4">
          <span className="sm:w-64 flex-shrink-0 flex items-start gap-2">
            <span className="px-1.5 py-0.5 rounded bg-lime-400/10 border border-lime-400/40 text-lime-400 text-xs font-mono font-semibold">
              R{index + 1}
            </span>
            <span className="text-sm font-semibold text-white">{item.rule}</span>
          </span>
          <span className="text-sm text-zinc-400 leading-relaxed">{item.logic}</span>
        </li>
      ))}
    </ol>
  );
}

export function ExceptionCodes({ codes }: { codes: readonly { code: string; meaning: string; action: string }[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {codes.map((item) => (
        <li key={item.code} className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-2">
          <code className="inline-block px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-mono font-semibold break-all">
            {item.code}
          </code>
          <p className="text-sm text-white leading-relaxed">{item.meaning}</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="font-semibold text-zinc-300">Next: </span>
            {item.action}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function DataModel({ entities }: { entities: readonly { entity: string; fields: readonly string[] }[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {entities.map((item) => (
        <li key={item.entity} className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-3">
          <h3 className="text-sm font-bold text-white font-mono">{item.entity}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {item.fields.map((field) => (
              <li key={field} className="px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 font-mono">
                {field}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
