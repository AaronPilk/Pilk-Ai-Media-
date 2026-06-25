"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";

export function WizardNavigation({
  current,
  total,
  onBack,
  onNext,
  isSubmitting,
}: {
  current: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  isSubmitting: boolean;
}) {
  const isLast = current === total - 1;

  return (
    <div className="mt-10 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={current === 0}
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink disabled:opacity-0"
      >
        <ArrowLeft size={16} aria-hidden /> Back
      </button>

      {isLast ? (
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Submit My Website Brief"}
          <ArrowUpRight size={16} aria-hidden />
        </button>
      ) : (
        <button type="button" onClick={onNext} className="btn btn-primary">
          Continue
          <ArrowUpRight size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
