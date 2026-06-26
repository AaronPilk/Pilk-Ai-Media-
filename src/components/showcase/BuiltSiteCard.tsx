"use client";

import { useState } from "react";
import type { BuiltSite } from "@/types/built-site";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

/**
 * Shows a real screenshot/video of the build when available; if the image is
 * missing (e.g. before screenshots are captured), falls back to a clean
 * faux-browser mockup instead of a broken image.
 */
export function BuiltSiteCard({ site, active = false }: { site: BuiltSite; active?: boolean }) {
  const [imgError, setImgError] = useState(false);
  const { assets } = site;

  if (assets.video) {
    return (
      <div className="faux h-full w-full">
        <video
          className="h-full w-full object-cover"
          src={assets.video}
          poster={assets.poster}
          muted
          loop
          playsInline
          autoPlay={active}
          preload="metadata"
        />
      </div>
    );
  }

  if (assets.desktop && !imgError) {
    return (
      <div className="faux h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assets.desktop}
          alt={`${site.name} website`}
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
        />
      </div>
    );
  }

  return <FauxBrowser accent={site.accent} url={`${site.slug}.pilk.ai`} className="h-full w-full" />;
}
