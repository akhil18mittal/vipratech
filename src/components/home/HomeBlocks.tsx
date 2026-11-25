import { Database, FileLock2, Lock, ScrollText, ShieldCheck, UserCheck } from "lucide-react";

// Homepage blocks a CFO looks for: how long it takes, how the data is protected, and which systems it reads.

/** From the first file to go-live, as dated milestones. */
export function Timeline({ steps }: { steps: readonly { when: string; title: string; detail: string }[] }) {
  return (
    <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-5">
      <span aria-hidden="true" className="hidden md:block absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-lime-400/60 via-emerald-400/40 to-transparent" />
      {steps.map((step, index) => (
        <li key={step.when} className="relative flex flex-col gap-3">
          <span className="relative z-10 self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950 border border-lime-400/50 text-lime-400 text-xs font-mono font-bold shadow-lg shadow-lime-400/10">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400" aria-hidden="true" />
            {step.when}
          </span>
          <div className="flex-1 p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-2 hover:border-lime-500/40 transition-colors">
            <h3 className="text-base font-bold text-white">
              <span className="text-zinc-500 font-mono text-xs mr-2">{String(index + 1).padStart(2, "0")}</span>
              {step.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

const SECURITY_ICONS = [FileLock2, Lock, ShieldCheck, Database, UserCheck, ScrollText];

/** Security commitments as tiles, in the order of SECURITY_ICONS. */
export function SecurityTiles({ items }: { items: readonly { title: string; detail: string }[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => {
        const Icon = SECURITY_ICONS[index % SECURITY_ICONS.length];
        return (
          <li key={item.title} className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl flex gap-4 hover:border-lime-500/40 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-lime-400" />
            </span>
            <span className="space-y-1">
              <span className="block text-sm font-bold text-white">{item.title}</span>
              <span className="block text-sm text-zinc-400 leading-relaxed">{item.detail}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Systems and portals, grouped, as monospace chips. Names only: no logos. */
export function SystemChips({ groups }: { groups: readonly { label: string; systems: readonly string[] }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {groups.map((group) => (
        <div key={group.label} className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-3">
          <h3 className="text-xs font-mono text-lime-400 uppercase font-bold tracking-wider">{group.label}</h3>
          <ul className="flex flex-wrap gap-2">
            {group.systems.map((system) => (
              <li key={system} className="px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-200 font-mono">
                {system}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
