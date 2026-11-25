/** A titled card per item: a use case's pain points, an industry's challenges, the homepage's problems. */
export function DetailCards({ items }: { items: readonly { title: string; detail: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <div key={item.title} className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-3 shadow-lg hover:border-lime-500/40 transition-colors">
          <h3 className="text-lg font-bold text-white">{item.title}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
