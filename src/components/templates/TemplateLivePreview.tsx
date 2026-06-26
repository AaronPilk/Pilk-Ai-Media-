"use client";

import { useEffect, useRef, useState } from "react";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

/**
 * Live, scaled preview of a template site. Renders the actual site in a
 * non-interactive iframe (scaled to fit) — at desktop width or, with
 * device="mobile", at a real phone width so the responsive mobile layout shows.
 * Falls back to the procedural mock when there's no standalone preview URL.
 */
export function TemplateLivePreview({
  liveUrl,
  accent = "#7c3aed",
  slug = "preview",
  className,
  device = "desktop",
}: {
  liveUrl?: string;
  accent?: string;
  slug?: string;
  className?: string;
  device?: "desktop" | "mobile";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const baseW = device === "mobile" ? 414 : 1280;
  const baseH = device === "mobile" ? 896 : 800;
  const [scale, setScale] = useState(0.28);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / baseW);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseW]);

  if (!liveUrl || liveUrl === "/") {
    return (
      <FauxBrowser accent={accent} url={`${slug}.pilk.ai`} variant={device} className={className} />
    );
  }

  const showBar = device === "desktop";

  return (
    <div className={`faux relative overflow-hidden ${className ?? ""}`} aria-hidden="true">
      {showBar && (
        <div className="faux__bar">
          <span className="faux__dot" />
          <span className="faux__dot" />
          <span className="faux__dot" />
          <span className="faux__url">{slug}.pilk.ai</span>
        </div>
      )}
      <div
        ref={ref}
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ top: showBar ? 34 : 0 }}
      >
        <iframe
          src={liveUrl}
          title={`${slug} preview`}
          loading="lazy"
          tabIndex={-1}
          scrolling="no"
          style={{
            width: `${baseW}px`,
            height: `${baseH}px`,
            border: 0,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
