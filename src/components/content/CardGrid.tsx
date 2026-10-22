import type { CardItem } from "../../types";
import { ContentCard } from "./ContentCard";

export function CardGrid({ items }: { items: readonly CardItem[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <li key={item.title}>
          <ContentCard item={item} />
        </li>
      ))}
    </ul>
  );
}
