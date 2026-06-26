"use client";

import { useEffect, useRef, useState } from "react";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

/**
 * Template preview. On DESKTOP it renders the real site live in a scaled,
 * non-interactive iframe. On mobile/tablet it renders a screenshot (if captured)
 * or the procedural mock — never an iframe, because a scaled 1280px iframe blows
 * out the layout width on iOS. Use "Open full preview" to browse the real site.
 */
export function TemplateLivePreview({
  liveUrl,
  accent = "#7c3aed",
  slug = "preview",
  className,
  device = "desktop",
  image,
}: {
  liveUrl?: string;
  accent?: string;
  slug?: string;
  className?: string;
  device?: "desktop" | "mobile";
  image?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const baseW = device === "mobile" ? 414 : 1280;
  const baseH = device === "mobile" ? 896 : 800;
  const [scale, setScale] = useState(0.28);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / baseW);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseW, isDesktop]);

  // Mobile/tablet (or no standalone site): screenshot-or-mock, never an iframe.
  if (!isDesktop || !liveUrl || liveUrl === "/") {
    return (
      <FauxBrowser
        accent={accent}
        url={`${slug}.pilk.ai`}
        image={image}
        variant={device}
        className={className}
      />
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
