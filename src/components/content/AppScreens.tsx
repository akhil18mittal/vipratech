/** The screens of the app in order, each drawn as a small window with what the user sees on it. */
export function AppScreens({ screens }: { screens: readonly { name: string; purpose: string; shows: readonly string[] }[] }) {
  return (
    <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {screens.map((screen, index) => (
        <li key={screen.name} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border-b border-slate-200" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="ml-2 text-xs text-slate-500 font-mono truncate">vipratech / {screen.name.toLowerCase()}</span>
          </div>
          <div className="p-4 space-y-3 flex-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-700 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                {index + 1}
              </span>
              {screen.name}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{screen.purpose}</p>
            <ul className="space-y-1.5">
              {screen.shows.map((item) => (
                <li key={item} className="flex items-start gap-2 px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="mt-1 w-1.5 h-1.5 rounded-sm bg-teal-600 flex-shrink-0" aria-hidden="true" />
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
