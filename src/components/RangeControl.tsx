interface RangeControlProps {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step?: number;
  description?: string;
  onChange: (value: number) => void;
}

export function RangeControl({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  description,
  onChange,
}: RangeControlProps) {
  return (
    <label className={`block ${description ? "space-y-1.5" : "space-y-2"}`}>
      <span className="flex justify-between text-xs font-mono">
        <span className="text-zinc-300">{label}</span>
        <span className="font-bold text-lime-400">{displayValue}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-lime-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
      />
      {description && (
        <span className="text-[10px] text-zinc-500 block font-mono">
          {description}
        </span>
      )}
    </label>
  );
}
