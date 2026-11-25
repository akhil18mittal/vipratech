import { CheckCircle2 } from "lucide-react";

export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2.5 max-w-3xl">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-1" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
