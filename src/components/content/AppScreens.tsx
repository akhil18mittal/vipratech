/** The screens of the app in order, each drawn as a small window with what the user sees on it. */
export function AppScreens({ screens }: { screens: readonly { name: string; purpose: string; shows: readonly string[] }[] }) {
  return (
    <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {screens.map((screen, index) => (
        <li key={screen.name} className="bg-zinc-900/70 border border-zinc-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-zinc-800" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="ml-2 text-xs text-zinc-500 font-mono truncate">vipratech / {screen.name.toLowerCase()}</span>
          </div>
          <div className="p-4 space-y-3 flex-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-lime-400/10 text-lime-400 border border-lime-400/20 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0">
                {index + 1}
              </span>
              {screen.name}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{screen.purpose}</p>
            <ul className="space-y-1.5">
              {screen.shows.map((item) => (
                <li key={item} className="flex items-start gap-2 px-2.5 py-1.5 rounded-md bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300">
                  <span className="mt-1 w-1.5 h-1.5 rounded-sm bg-lime-400 flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
