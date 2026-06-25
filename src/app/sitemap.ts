import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { templates } from "@/content/templates";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.siteUrl;
  const now = new Date();

  const staticRoutes = [
    "",
    "/work",
    "/templates",
    "/real-estate",
    "/process",
    "/contact",
    "/lab",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const templateRoutes = templates.map((t) => ({
    url: `${base}/templates/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const workRoutes = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...templateRoutes, ...workRoutes];
}
