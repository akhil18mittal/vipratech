import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { SolutionLink } from "../../types";

export function HomeSolutions({ solutions }: { solutions: SolutionLink[] }) {
  return (
    <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-12">Solutions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((solution) => (
          <motion.a
            key={solution.href}
            href={solution.href}
            whileHover={{ y: -4 }}
            className="p-6 bg-zinc-900/70 border border-zinc-800 hover:border-lime-500/40 rounded-2xl space-y-3 shadow-lg transition-colors block"
          >
            <h3 className="text-lg font-bold text-white flex items-center justify-between gap-3">
              {solution.name}
              <ArrowUpRight className="w-4 h-4 text-lime-400 flex-shrink-0" />
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{solution.headline}</p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
