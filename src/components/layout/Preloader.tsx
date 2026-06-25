"use client";

import { useEffect, useState } from "react";

const KEY = "pilk-intro-seen";

/** Short, skippable intro. Collapses into the page. Honors reduced-motion + repeat visits. */
export function Preloader() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(KEY);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => dismiss(), 1700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    setLeaving(true);
    sessionStorage.setItem(KEY, "1");
    setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 600);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-bg transition-opacity duration-500"
      style={{ opacity: leaving ? 0 : 1 }}
      role="status"
      aria-label="Loading"
      onClick={dismiss}
    >
      <div
        className="relative"
        style={{
          width: leaving ? "100vw" : "260px",
          height: leaving ? "100vh" : "168px",
          transition: "width 0.6s cubic-bezier(0.16,1,0.3,1), height 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="faux h-full w-full">
          <div className="faux__bar">
            <span className="faux__dot" />
            <span className="faux__dot" />
            <span className="faux__dot" />
            <span className="faux__url">pilk.ai</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-2xl font-semibold tracking-tight">
              Pilk<span className="text-accent">.ai</span>
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-8 right-8 text-xs uppercase tracking-[0.2em] text-muted hover:text-ink"
      >
        Skip
      </button>
    </div>
  );
}
