import { appBuilding } from "@/content/apps";
import type { Service } from "./types";
import { websites } from "./websites";
import { aiConsulting } from "./ai-consulting";
import { aiAutomationChatbots } from "./ai-automation-chatbots";
import { metaAds } from "./meta-ads";
import { socialMediaAutomation } from "./social-media-automation";
import { leadFunnels } from "./lead-funnels";
import { skoolCommunityGrowth } from "./skool-community-growth";

export type { Service } from "./types";

/** Pages rendered by /services/[slug]. Each lives in its own file so the
 *  sitemap can date every page by its own last commit. */
export const servicePages: Service[] = [
  websites,
  aiConsulting,
  aiAutomationChatbots,
  metaAds,
  socialMediaAutomation,
  leadFunnels,
  skoolCommunityGrowth,
];

export type ServiceCard = Pick<
  Service,
  "slug" | "href" | "name" | "serviceType" | "summary"
>;

/** Everything Pilk.ai offers, in the order shown on the services hub, footer and
 *  schema. Custom app building keeps its existing /apps/ page. */
export const serviceCatalog: ServiceCard[] = [
  websites,
  {
    slug: "custom-apps",
    href: "/apps/",
    name: "Custom App Building",
    serviceType: "Custom software and mobile app development",
    summary: `Mobile apps, internal tools and AI products, designed and built end to end. ${appBuilding.pricingLabel}.`,
  },
  aiConsulting,
  aiAutomationChatbots,
  metaAds,
  socialMediaAutomation,
  leadFunnels,
  skoolCommunityGrowth,
].map(({ slug, href, name, serviceType, summary }) => ({
  slug,
  href,
  name,
  serviceType,
  summary,
}));

export function getServicePage(slug: string): Service | undefined {
  return servicePages.find((s) => s.slug === slug);
}

export function getServiceCard(slug: string): ServiceCard | undefined {
  return serviceCatalog.find((s) => s.slug === slug);
}

/** Source files behind each service page, for git-dated sitemap lastmod. */
export const serviceSourceFiles: Record<string, string> = {
  websites: "src/content/services/websites.ts",
  "ai-consulting": "src/content/services/ai-consulting.ts",
  "ai-automation-chatbots": "src/content/services/ai-automation-chatbots.ts",
  "meta-ads": "src/content/services/meta-ads.ts",
  "social-media-automation": "src/content/services/social-media-automation.ts",
  "lead-funnels": "src/content/services/lead-funnels.ts",
  "skool-community-growth": "src/content/services/skool-community-growth.ts",
};
