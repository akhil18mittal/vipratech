/** A titled card per item: a use case's pain points, the homepage's problems. */
export function DetailCards({ items }: { items: readonly { title: string; detail: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <div key={item.title} className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
