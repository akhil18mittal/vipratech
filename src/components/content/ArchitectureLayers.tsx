export function ArchitectureLayers({ id, layers }: { id: string; layers: readonly { name: string; components: readonly string[] }[] }) {
  return (
    <ol id={id} className="space-y-3">
      {layers.map((layer) => (
        <li
          key={layer.name}
          className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <span className="text-xs font-mono text-lime-400 uppercase font-bold sm:w-48 flex-shrink-0">{layer.name}</span>
          <ul className="flex flex-wrap gap-2">
            {layer.components.map((component) => (
              <li
                key={component}
                className="px-2.5 py-1 rounded-md bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 font-mono"
              >
                {component}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
