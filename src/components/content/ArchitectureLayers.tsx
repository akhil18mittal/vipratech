export function ArchitectureLayers({ id, layers }: { id: string; layers: readonly { name: string; components: readonly string[] }[] }) {
  return (
    <ol id={id} className="space-y-3">
      {layers.map((layer) => (
        <li
          key={layer.name}
          className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <span className="text-xs text-teal-700 uppercase tracking-wide font-semibold sm:w-48 flex-shrink-0">{layer.name}</span>
          <ul className="flex flex-wrap gap-2">
            {layer.components.map((component) => (
              <li key={component} className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-sm text-slate-700">
                {component}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
