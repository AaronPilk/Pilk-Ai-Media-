"use client";

import { useEffect, useRef, useState } from "react";

/** Understated custom cursor. Hidden on touch/reduced-motion via CSS. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState("default");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;

    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (target) {
        setState(target.dataset.cursor || "view");
        setLabel(target.dataset.cursorLabel || "");
      } else {
        setState("default");
        setLabel("");
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" data-state={state} aria-hidden="true">
      {label && <span className="cursor__label">{label}</span>}
    </div>
  );
}
