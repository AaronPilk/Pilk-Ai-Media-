"use client";

import { useEffect, useRef, useState } from "react";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

const BASE_W = 1280;
const BASE_H = 800;

/**
 * Live, scaled preview of a template site inside a browser frame. Renders the
 * actual site in a non-interactive iframe (scaled to fit). Falls back to the
 * procedural mock when there's no standalone preview URL (e.g. the custom site).
 */
export function TemplateLivePreview({
  liveUrl,
  accent = "#7c3aed",
  slug = "preview",
  className,
}: {
  liveUrl?: string;
  accent?: string;
  slug?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.28);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / BASE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // No standalone site (custom build points at "/") → procedural mock.
  if (!liveUrl || liveUrl === "/") {
    return <FauxBrowser accent={accent} url={`${slug}.pilk.ai`} className={className} />;
  }

  return (
    <div className={`faux relative overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <div className="faux__bar">
        <span className="faux__dot" />
        <span className="faux__dot" />
        <span className="faux__dot" />
        <span className="faux__url">{slug}.pilk.ai</span>
      </div>
      <div ref={ref} className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: 34 }}>
        <iframe
          src={liveUrl}
          title={`${slug} preview`}
          loading="lazy"
          tabIndex={-1}
          scrolling="no"
          style={{
            width: `${BASE_W}px`,
            height: `${BASE_H}px`,
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
