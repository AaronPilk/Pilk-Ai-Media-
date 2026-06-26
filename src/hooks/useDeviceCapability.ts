"use client";

import { useEffect, useState } from "react";

export type DeviceCapability = "high" | "medium" | "low" | "reduced-motion";

function detect(): DeviceCapability {
  if (typeof window === "undefined") return "medium";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "reduced-motion";
  }

  // WebGL availability — the only thing that forces the static fallback.
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webgl = false;
  }
  if (!webgl) return "low";

  const cores = navigator.hardwareConcurrency ?? 4;
  const width = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  // Big desktop machines get the full-resolution scene; everything else
  // (including phones/tablets) still renders the orb at medium quality.
  if (width >= 1280 && cores > 8 && !coarse) return "high";
  return "medium";
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>("medium");

  useEffect(() => {
    setCapability(detect());
  }, []);

  return capability;
}
