"use client";

import { cn } from "@/lib/utils";

export function WizardProgress({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="eyebrow text-accent">
          Step {current + 1} / {steps.length}
        </span>
        <span>{steps[current]}</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {steps.map((step, i) => (
          <span
            key={step}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-500",
              i <= current ? "bg-accent" : "bg-line"
            )}
          />
        ))}
      </div>
    </div>
  );
}
