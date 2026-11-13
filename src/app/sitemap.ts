import type { MetadataRoute } from "next";
import { templates } from "@/content/templates";
import { projects } from "@/content/projects";
import { servicePages, serviceSourceFiles } from "@/content/services";
import { local } from "@/content/local";
import { absoluteUrl } from "@/lib/metadata";
import { lastModified } from "@/lib/lastmod";

export const dynamic = "force-static";

type Entry = {
  path: string;
  /** Files whose last commit dates this page. Page-specific only: shared
   *  chrome (header, footer, layout) would make every lastmod move together. */
  sources: string[];
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

// Only indexable pages belong here. Utility pages (the /checkout redirect stubs, /start/*,
// /inquiry, /lab, /fourth-of-july, the listing demo) are noindex and left out.
const HOME_SOURCES = [
  "src/app/page.tsx",
  "src/components/sections/Hero.tsx",
  "src/components/sections/PositioningAssembler.tsx",
  "src/components/sections/BuiltSiteShowcase.tsx",
  "src/components/sections/TemplateCatalog.tsx",
  "src/components/sections/Capabilities.tsx",
  "src/components/sections/AppBuilding.tsx",
  "src/components/sections/ProcessTimeline.tsx",
  "src/components/sections/Pricing.tsx",
  "src/components/sections/FAQ.tsx",
  "src/content/packages.ts",
  "src/content/faq.ts",
  "src/content/built-sites.ts",
];

const entries: Entry[] = [
  { path: "/", sources: HOME_SOURCES, priority: 1, changeFrequency: "weekly" },
  {
    path: "/services/",
    sources: ["src/app/services/page.tsx", "src/content/services/index.ts"],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  ...servicePages.map((s) => ({
    path: s.href,
    sources: [
      "src/app/services/[slug]/page.tsx",
      "src/components/services/ServicePageView.tsx",
      serviceSourceFiles[s.slug],
    ],
    priority: 0.9,
    changeFrequency: "monthly" as const,
  })),
  {
    path: "/apps/",
    sources: [
      "src/app/apps/page.tsx",
      "src/content/apps.ts",
      "src/components/apps",
    ],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: local.path,
    sources: [
      "src/app/st-petersburg-tampa-bay/page.tsx",
      "src/content/local.ts",
    ],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/mortgage/",
    sources: ["src/app/mortgage/page.tsx", "src/content/templates.ts"],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/real-estate/",
    sources: [
      "src/app/real-estate/page.tsx",
      "src/components/sections/RealEstateFeatures.tsx",
      "src/components/sections/OwnVsRent.tsx",
      "src/content/templates.ts",
      "src/content/faq.ts",
    ],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/own-vs-rent/",
    sources: [
      "src/app/own-vs-rent/page.tsx",
      "src/components/sections/OwnVsRent.tsx",
    ],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/templates/",
    sources: [
      "src/app/templates/page.tsx",
      "src/components/sections/TemplateCatalog.tsx",
      "src/content/templates.ts",
    ],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  ...templates.map((t) => ({
    path: `/templates/${t.slug}/`,
    sources: [
      "src/app/templates/[slug]/page.tsx",
      "src/content/templates.ts",
      `public/template-previews/${t.slug}`,
    ],
    priority: 0.5,
    changeFrequency: "monthly" as const,
  })),
  {
    path: "/work/",
    sources: ["src/app/work/page.tsx", "src/content/projects.ts"],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  ...projects.map((p) => ({
    path: `/work/${p.slug}/`,
    sources: [
      "src/app/work/[slug]/page.tsx",
      "src/content/projects.ts",
      `public${p.cover}`,
    ],
    priority: 0.5,
    changeFrequency: "monthly" as const,
  })),
  {
    path: "/process/",
    sources: [
      "src/app/process/page.tsx",
      "src/components/sections/ProcessTimeline.tsx",
    ],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/contact/",
    sources: ["src/app/contact/page.tsx"],
    priority: 0.6,
    changeFrequency: "yearly",
  },
  {
    path: "/privacy/",
    sources: ["src/app/privacy/page.tsx", "src/content/legal/privacy.ts"],
    priority: 0.2,
    changeFrequency: "yearly",
  },
  {
    path: "/terms/",
    sources: ["src/app/terms/page.tsx", "src/content/legal/terms.ts"],
    priority: 0.2,
    changeFrequency: "yearly",
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return entries.map((e) => ({
    url: absoluteUrl(e.path),
    lastModified: lastModified(e.sources),
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
