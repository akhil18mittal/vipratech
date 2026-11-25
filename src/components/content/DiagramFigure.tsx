import type { CSSProperties } from "react";
import type { Diagram } from "../../types";

interface DiagramFigureProps {
  /** The use case title, for the alt text. */
  title: string;
  kind: "workflow" | "architecture";
  diagram: Diagram;
  /** A top-to-bottom version for phones. */
  narrow?: Diagram;
  /** The id of the step or layer list that describes the diagram in text. */
  describedBy: string;
}

// Diagram text is 16px at full size. A diagram shrinks to fit down to 3/4 of its size (12px text), then scrolls
// sideways instead of shrinking further.
const MIN_SCALE = 0.75;

const sizeVars = (diagram: Diagram, suffix: string) => ({
  [`--diagram-min${suffix}`]: `${Math.round(diagram.width * MIN_SCALE)}px`,
  [`--diagram-max${suffix}`]: `${diagram.width}px`,
});

export function DiagramFigure({ title, kind, diagram, narrow = diagram, describedBy }: DiagramFigureProps) {
  const alt = `${title}: ${kind} diagram`;
  return (
    <figure className="p-4 sm:p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl">
      <div
        role="region"
        aria-label={alt}
        tabIndex={0}
        className="overflow-x-auto rounded-lg focus-visible:outline focus-visible:outline-lime-400"
      >
        <picture>
          <source media="(max-width: 639px)" srcSet={narrow.src} width={narrow.width} height={narrow.height} />
          <img
            src={diagram.src}
            width={diagram.width}
            height={diagram.height}
            alt={alt}
            aria-describedby={describedBy}
            loading="lazy"
            decoding="async"
            style={{ ...sizeVars(diagram, ""), ...sizeVars(narrow, "-narrow") } as CSSProperties}
            className="block w-full h-auto mx-auto min-w-(--diagram-min-narrow) max-w-(--diagram-max-narrow) sm:min-w-(--diagram-min) sm:max-w-(--diagram-max)"
          />
        </picture>
      </div>
      <figcaption className="mt-4 text-xs font-mono">
        <a href={diagram.src} target="_blank" rel="noopener" className="text-lime-400 hover:text-lime-300 transition-colors">
          Open full size
        </a>
      </figcaption>
    </figure>
  );
}
