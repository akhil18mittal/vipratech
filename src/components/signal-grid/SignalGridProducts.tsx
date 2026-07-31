import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { PRODUCTS_SYSTEMS } from "../../data/companyData";

export function SignalGridProducts() {
  const [activeProduct, setActiveProduct] = useState(PRODUCTS_SYSTEMS[0].id);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-mono text-lime-400 uppercase tracking-widest font-bold">
          Verified Software
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
          Products & Systems Built
        </h2>
        <p className="text-xs text-zinc-400 mt-2 font-mono">
          Demonstrated software architectures across model-aware security, multi-tenant revenue automation, regulated voice AI, and applied research.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCTS_SYSTEMS.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => setActiveProduct(product.id)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              product.id === activeProduct
                ? "bg-zinc-900 border-lime-500 shadow-xl shadow-lime-500/10"
                : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-mono">{product.name}</h3>
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                    product.evidenceLevel === "Built/Deployed"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {product.evidenceLevel}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {product.shortDesc}
              </p>

              <div className="space-y-1.5 pt-2">
                {product.capabilities.slice(0, 3).map((capability, index) => (
                  <div key={index} className="text-[11px] text-zinc-300 flex items-center gap-1.5 font-mono">
                    <span className="text-lime-400">•</span>
                    <span className="truncate">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>View Details</span>
              <ChevronRight className="w-4 h-4 text-lime-400" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
