import type { CardItem } from "../../types";
import { ContentCard } from "./ContentCard";

export function CardGrid({ items, columns = 3 }: { items: readonly CardItem[]; columns?: 2 | 3 }) {
  return (
    <ul className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((item) => (
        <li key={item.title}>
          <ContentCard item={item} />
        </li>
      ))}
    </ul>
  );
}
