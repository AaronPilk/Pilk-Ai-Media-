import { cn } from "@/lib/utils";

/**
 * Procedural website preview (no binary assets). Swap for a real screenshot/video
 * by passing `image` — the faux mock only renders when no image is provided.
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
  if (image) {
    return (
      <div className={cn("faux", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt ?? "Website preview"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
