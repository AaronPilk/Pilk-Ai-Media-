import type { BuiltSite } from "@/types/built-site";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

/** Renders a real build's video/image when present, else a premium faux-browser fallback. */
export function BuiltSiteCard({ site, active = false }: { site: BuiltSite; active?: boolean }) {
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

  // image (when present) or procedural fallback
  return (
    <FauxBrowser
      accent={site.accent}
      url={`${site.slug}.pilk.ai`}
      image={assets.desktop}
      className="h-full w-full"
    />
  );
}
