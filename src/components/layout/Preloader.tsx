"use client";

import { useEffect, useMemo, useState } from "react";

const KEY = "pilk-intro-seen";

type Phase = "in" | "explode";

export function Preloader() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("in");

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 28 + Math.random() * 0.5;
        const dist = 200 + Math.random() * 320;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size: 4 + Math.random() * 9,
          delay: Math.random() * 0.06,
        };
      }),
    []
  );

  useEffect(() => {
    const seen = sessionStorage.getItem(KEY);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    if (reduced) {
      const t = setTimeout(dismiss, 350);
      return () => clearTimeout(t);
    }

    const explodeAt = setTimeout(() => setPhase("explode"), 1300);
    const removeAt = setTimeout(dismiss, 2100);
    return () => {
      clearTimeout(explodeAt);
      clearTimeout(removeAt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(KEY, "1");
    setVisible(false);
    document.body.style.overflow = "";
  };

  const blowUp = () => {
    if (phase === "explode") return;
    setPhase("explode");
    setTimeout(dismiss, 800);
  };

  if (!visible) return null;

  const exploding = phase === "explode";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-bg transition-opacity duration-700"
      style={{ opacity: exploding ? 0 : 1, transitionDelay: exploding ? "0.15s" : "0s" }}
      role="status"
      aria-label="Loading"
      onClick={blowUp}
    >
      <div className="relative h-0 w-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="preloader-particle"
            style={{
              width: p.size,
              height: p.size,
              transform: exploding
                ? `translate(${p.x}px, ${p.y}px) scale(0.2)`
                : "translate(0px, 0px) scale(1)",
              opacity: exploding ? 0 : 0.9,
              transition: `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${p.delay}s, opacity 0.8s ease ${p.delay}s`,
            }}
          />
        ))}

        <div
          className={`preloader-orb ${exploding ? "" : "is-vibrating"}`}
          style={
            exploding
              ? {
                  transform: "scale(26)",
                  opacity: 0,
                  transition:
                    "transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.7s ease 0.1s",
                }
              : undefined
          }
        />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          blowUp();
        }}
        className="absolute bottom-8 right-8 text-xs uppercase tracking-[0.2em] text-muted hover:text-ink"
      >
        Skip
      </button>
    </div>
  );
}
