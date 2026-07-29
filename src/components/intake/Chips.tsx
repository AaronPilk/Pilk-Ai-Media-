"use client";

const base =
  "min-h-[48px] rounded-sm px-4 py-2 text-sm transition select-none cursor-pointer border";
const on = "border-accent bg-accent text-white";
const off = "border-line bg-surface text-ink hover:border-accent/50";

export function ChipSingle({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            type="button"
            key={o.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`${base} ${active ? on : off}`}
          >
            {active ? "✓ " : ""}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ChipMulti({
  options,
  value,
  onToggle,
}: {
  options: string[];
  value: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o);
        return (
          <button
            type="button"
            key={o}
            aria-pressed={active}
            onClick={() => onToggle(o)}
            className={`${base} ${active ? on : off}`}
          >
            {active ? "✓ " : ""}
            {o}
          </button>
        );
      })}
    </div>
  );
}
