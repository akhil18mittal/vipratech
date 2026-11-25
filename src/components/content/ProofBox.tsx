import type { ProofProject } from "../../content/schema";

/** One approved proof project, as written in proof-projects.json (client names are already anonymised there). */
export function ProofBox({ proof }: { proof: ProofProject }) {
  return (
    <div className="p-5 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
      <h3 className="text-base font-bold text-slate-900">{proof.title}</h3>
      <p className="text-sm text-teal-800 font-semibold">{proof.client_label}</p>
      <p className="text-sm text-slate-700 leading-relaxed">{proof.summary}</p>
    </div>
  );
}
