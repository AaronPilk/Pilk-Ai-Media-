export type ServiceStep = { title: string; body: string };
export type ServiceFaq = { q: string; a: string };
export type ServiceLink = { label: string; href: string; note: string };

/**
 * One indexable service page. Copy rules: plain language, no invented proof.
 * Related work may only point at real projects already on the site.
 */
export type Service = {
  slug: string;
  /** Path of the page. Most live under /services/, custom apps keep /apps/. */
  href: string;
  /** Short name used in nav, cards and schema. */
  name: string;
  /** schema.org serviceType. */
  serviceType: string;
  /** One line for cards and the services hub. */
  summary: string;
  /** <title> without the brand suffix; keep it under 50 characters. */
  title: string;
  /** Meta description, 70 to 155 characters. */
  description: string;
  /** Social share image, relative to /public. */
  image?: string;
  eyebrow: string;
  headline: string;
  intro: string;
  whatItIs: string[];
  whoFor: string[];
  steps: ServiceStep[];
  included: string[];
  /** Heading for the included list. Defaults to "What's included". */
  includedHeading?: string;
  /** Honest pricing note. Only prices that already appear on the site. */
  pricing?: string;
  relatedWork?: ServiceLink[];
  faqs: ServiceFaq[];
  /** Where "Start a project" goes. Website work uses the full brief; other
   *  services use the short inquiry form. Defaults to /inquiry/. */
  ctaHref?: string;
  /** Slugs of sibling services to cross-link. */
  related: string[];
};
