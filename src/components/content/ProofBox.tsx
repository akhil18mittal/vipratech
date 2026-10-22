import type { ProofProject } from "../../content/schema";

/** One approved proof project, as written in proof-projects.json (client names are already anonymised there). */
export function ProofBox({ proof }: { proof: ProofProject }) {
  return (
    <div className="p-5 bg-lime-500/10 border border-lime-500/20 rounded-xl space-y-2">
      <h3 className="text-sm font-bold text-white">{proof.title}</h3>
      <p className="text-xs text-lime-400 font-mono font-bold">{proof.client_label}</p>
      <p className="text-xs text-zinc-300 leading-relaxed">{proof.summary}</p>
    </div>
  );
}
