import { CheckCircle2 } from "lucide-react";

export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2.5 max-w-3xl">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-xs text-zinc-200 font-medium">
          <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
