import type { NavLink } from "../../types";

export function HomeIndustries({ industries }: { industries: NavLink[] }) {
  return (
    <section id="industries" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-10">
        <a href="/industries/" className="hover:text-lime-400 transition-colors">
          Industries
        </a>
      </h2>

      <ul className="flex flex-wrap gap-3">
        {industries.map((industry) => (
          <li key={industry.href}>
            <a
              href={industry.href}
              className="block px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 hover:border-lime-500/40 rounded-xl text-xs font-mono font-bold text-zinc-300 hover:text-lime-400 transition-all"
            >
              {industry.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
