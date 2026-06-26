"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Procedural website preview (no binary assets). If `image` is provided it
 * renders the screenshot; if that image fails to load (not captured yet), it
 * falls back to the procedural mock instead of a broken image.
 */
export function FauxBrowser({
  accent = "#7c3aed",
  url = "preview.pilk.ai",
  image,
  alt,
  variant = "desktop",
  className,
}: {
  accent?: string;
  url?: string;
  image?: string;
  alt?: string;
  variant?: "desktop" | "mobile";
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (image && !imgError) {
    return (
      <div className={cn("faux", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt ?? "Website preview"}
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("faux", className)}
      style={{ ["--ph-accent" as string]: accent }}
      aria-hidden="true"
    >
      <div className="faux__bar">
        <span className="faux__dot" />
        <span className="faux__dot" />
        <span className="faux__dot" />
        <span className="faux__url">{url}</span>
      </div>
      <div className="faux__body">
        <div className="faux__hero" />
        {variant === "desktop" ? (
          <div className="faux__rows">
            <div className="faux__col" />
            <div className="faux__col" />
            <div className="faux__col" />
          </div>
        ) : (
          <div className="faux__rows" style={{ flexDirection: "column" }}>
            <div className="faux__col" style={{ flex: "none", height: "40%" }} />
            <div className="faux__col" style={{ flex: "none", height: "40%" }} />
          </div>
        )}
      </div>
    </div>
  );
}
