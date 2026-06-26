"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PreloaderCanvas = dynamic(
  () => import("@/components/canvas/PreloaderCanvas").then((m) => m.PreloaderCanvas),
  { ssr: false, loading: () => null }
);

const KEY = "pilk-intro-seen";

export function Preloader() {
  const [visible, setVisible] = useState(false);
  const [explode, setExplode] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(KEY);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    if (reduced) {
      const t = setTimeout(dismiss, 400);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => setExplode(true), 1500);
    const t2 = setTimeout(() => setLeaving(true), 1850);
    const t3 = setTimeout(dismiss, 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(KEY, "1");
    setVisible(false);
    document.body.style.overflow = "";
  };

  const blowUp = () => {
    if (explode) return;
    setExplode(true);
    setTimeout(() => setLeaving(true), 300);
    setTimeout(dismiss, 1100);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-bg transition-opacity duration-700"
      style={{ opacity: leaving ? 0 : 1 }}
      role="status"
      aria-label="Loading"
      onClick={blowUp}
    >
      <div className="absolute inset-0">
        <PreloaderCanvas explode={explode} />
      </div>

      {explode && <div className="preloader-flash pointer-events-none absolute inset-0" />}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          blowUp();
        }}
        className="absolute bottom-8 right-8 z-10 text-xs uppercase tracking-[0.2em] text-muted hover:text-ink"
      >
        Skip
      </button>
    </div>
  );
}
