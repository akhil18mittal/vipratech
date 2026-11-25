export function FounderBlock() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl">
        <img
          src="/images/founder.jpg"
          width={320}
          height={320}
          alt="Akhilesh Mittal"
          loading="lazy"
          decoding="async"
          className="w-20 h-20 rounded-xl object-cover border border-zinc-800 flex-shrink-0"
        />
        <div className="space-y-1">
          <p className="text-sm font-bold text-white font-mono">Akhilesh Mittal, founder</p>
          <p className="text-sm text-zinc-300 leading-relaxed">
            IIT ISM Dhanbad and IMT Ghaziabad. Spent 8 years building and leading engineering on a security-testing
            platform for a New Zealand company. Built the claims system that a packaged-food brand's finance team runs
            every month. You work with him directly.
          </p>
        </div>
      </div>
    </section>
  );
}
