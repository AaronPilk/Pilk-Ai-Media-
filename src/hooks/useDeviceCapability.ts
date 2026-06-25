"use client";

import { useEffect, useState } from "react";

export type DeviceCapability = "high" | "medium" | "low" | "reduced-motion";

function detect(): DeviceCapability {
  if (typeof window === "undefined") return "medium";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "reduced-motion";
  }

  // WebGL availability
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    webgl = false;
  }
  if (!webgl) return "low";

  const cores = navigator.hardwareConcurrency ?? 4;
  const width = window.innerWidth;
  const dpr = window.devicePixelRatio ?? 1;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (coarse || width < 768 || cores <= 4) return "low";
  if (width < 1280 || cores <= 8 || dpr > 2.5) return "medium";
  return "high";
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>("medium");

  useEffect(() => {
    setCapability(detect());
  }, []);

  return capability;
}
