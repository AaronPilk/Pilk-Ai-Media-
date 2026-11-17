/**
 * Blog topics. Each one hangs off the page it supports (its "money page"):
 * posts link up to it, and that page lists the posts back.
 */
export const blogCategories = [
  {
    id: "websites",
    name: "Websites",
    blurb: "What a small business website costs, how long it takes, who owns it and how to hire for it.",
    money: { href: "/services/websites/", label: "How our website builds work" },
  },
  {
    id: "real-estate",
    name: "Real estate",
    blurb: "Websites, listing pages and lead capture for agents, teams and brokerages.",
    money: { href: "/real-estate/", label: "Real estate websites" },
  },
  {
    id: "mortgage",
    name: "Mortgage",
    blurb: "Websites, compliance basics and marketing for loan officers and mortgage brokers.",
    money: { href: "/mortgage/", label: "Mortgage websites" },
  },
  {
    id: "title",
    name: "Title companies",
    blurb: "Websites and marketing for title agencies and affiliated title businesses.",
    money: { href: "/services/websites/", label: "How our website builds work" },
  },
  {
    id: "local",
    name: "St. Petersburg & Tampa Bay",
    blurb: "Getting found locally: Google Business Profile, Bing Places and local search.",
    money: { href: "/st-petersburg-tampa-bay/", label: "Pilk.ai in St. Petersburg & Tampa Bay" },
  },
  {
    id: "ai",
    name: "AI for business",
    blurb: "Where AI actually saves a small business time, what it costs and where it goes wrong.",
    money: { href: "/services/ai-consulting/", label: "AI consulting" },
  },
  {
    id: "automation",
    name: "Automation & chatbots",
    blurb: "Instant replies, chatbots, review requests, texting rules and follow-up that runs itself.",
    money: { href: "/services/ai-automation-chatbots/", label: "AI automation & chatbots" },
  },
  {
    id: "crm",
    name: "CRM & lead funnels",
    blurb: "GoHighLevel, funnels, forms and pipelines for service businesses.",
    money: { href: "/services/lead-funnels/", label: "Lead funnels" },
  },
  {
    id: "meta-ads",
    name: "Meta ads",
    blurb: "Facebook and Instagram ads: cost, special ad categories, tracking and what to fix.",
    money: { href: "/services/meta-ads/", label: "Meta ads" },
  },
  {
    id: "social",
    name: "Social media",
    blurb: "Posting rhythm, automation tools and getting more out of each piece of content.",
    money: { href: "/services/social-media-automation/", label: "Social media automation" },
  },
  {
    id: "skool",
    name: "Skool communities",
    blurb: "Starting, pricing and growing a community on Skool.",
    money: { href: "/services/skool-community-growth/", label: "Skool community growth" },
  },
  {
    id: "apps",
    name: "Apps",
    blurb: "What a custom app costs, when you need one and how it gets into the App Store.",
    money: { href: "/apps/", label: "Custom app building" },
  },
  {
    id: "search",
    name: "Search & AI search",
    blurb: "Showing up in Google, Bing, ChatGPT and AI Overviews, without tricks.",
    money: { href: "/services/websites/", label: "How our website builds work" },
  },
] as const;

export type BlogCategory = (typeof blogCategories)[number];
export type BlogCategoryId = BlogCategory["id"];

export function getCategory(id: BlogCategoryId): BlogCategory {
  const c = blogCategories.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown blog category ${id}`);
  return c;
}
