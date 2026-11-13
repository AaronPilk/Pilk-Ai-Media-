import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

// Cloudflare may prepend its own managed block (AI crawler rules) in front of
// this file at the edge; that is configured in the dashboard, not here.
// Utility pages are kept out of search with noindex meta tags rather than
// Disallow, because a blocked page can still be indexed from links and its
// noindex would never be read.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
