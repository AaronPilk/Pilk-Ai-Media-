"use client";

import { useEffect } from "react";
import { useExperienceStore } from "@/stores/experience-store";

/** Tracks normalized pointer (-1..1) into the experience store for WebGL/cursor. */
export function usePointerPosition() {
  const setPointer = useExperienceStore((s) => s.setPointer);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      setPointer(x, y);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [setPointer]);
}
