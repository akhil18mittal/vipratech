import { ChevronRight } from "lucide-react";
import type { Crumb } from "../../lib/seo";

/** The visible trail. The last crumb is the current page. BaseLayout adds the matching BreadcrumbList JSON-LD. */
export function Breadcrumbs({ crumbs }: { crumbs: readonly Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-zinc-500">
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3 h-3 text-zinc-600" />}
              {isCurrent ? (
                <span aria-current="page" className="text-zinc-300">
                  {crumb.name}
                </span>
              ) : (
                <a href={crumb.path} className="hover:text-lime-400 transition-colors">
                  {crumb.name}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
