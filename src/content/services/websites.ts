import type { Service } from "./types";
import { everyBuildIncludes } from "@/content/packages";
import { hostingPrice, packageName, packagePrice } from "./pricing";

export const websites: Service = {
  slug: "websites",
  href: "/services/websites/",
  name: "Websites",
  serviceType: "Website design and development",
  summary:
    "Fast, mobile-first websites built to turn visitors into calls, bookings and form fills.",
  title: "Web Design & Development in St. Petersburg, FL",
  description:
    "Custom and template-based websites for service businesses, designed and built by Pilk.ai in St. Petersburg, FL. Mobile-first, fast, and you own the site.",
  image: "/brand/brand-light.jpg",
  eyebrow: "Websites",
  headline: "Websites that look the part and bring in leads.",
  intro:
    "We design and build websites for service businesses, from a single listing page to a fully custom site with a CRM behind it. Start from one of our templates or start from a blank page.",
  whatItIs: [
    "Every site is built around one job: turning a visitor into a call, a booking or a form submission. That means clear pages, fast load times, forms that actually reach you, and tracking so you can see what's happening.",
    "You own the finished website. We can host and look after it for you each month, or hand it to your team. Either way it's yours, on your domain.",
  ],
  whoFor: [
    "Real estate agents, brokerages, mortgage and title companies, where most of our template catalog is focused",
    "Local service businesses that need a credible site customers can find and trust",
    "Businesses with an outdated site that doesn't bring in inquiries",
    "Founders launching a product who need a marketing site",
  ],
  steps: [
    {
      title: "Kickoff and direction",
      body: "We talk through your business, audience, offer, the pages you need and examples you like.",
    },
    {
      title: "Structure and design",
      body: "We map the pages and the path to a lead, then design the site with your colors, imagery and brand, starting from a template or from scratch.",
    },
    {
      title: "Build and connect",
      body: "The design becomes a responsive site with your content, working forms, analytics, your domain, and CRM connections where you need them.",
    },
    {
      title: "Review and launch",
      body: "You review it while we test devices, browsers, forms, links and speed. Then it goes live. Qualified projects on a standard template follow our seven-day build.",
    },
  ],
  included: [...everyBuildIncludes],
  includedHeading: "Every template build includes",
  pricing: `${packageName("listing")}: ${packagePrice("listing")}. ${packageName("template")}: ${packagePrice("template")}. ${packageName("custom")}: ${packagePrice("custom")}. ${packageName("crm")}: ${packagePrice("crm")}. Optional hosting and support: ${hostingPrice}. Mortgage websites have their own package. Every project gets a written quote before any work or payment.`,
  relatedWork: [
    {
      label: "Stephenie Tocado Real Estate",
      href: "/work/stephenie-tocado/",
      note: "A personal real estate brand site built to capture qualified leads.",
    },
    {
      label: "Star Processing",
      href: "/work/star-processing/",
      note: "A conversion-focused site for a third-party loan-processing company.",
    },
    {
      label: "Carnegie Title",
      href: "/work/carnegie-title/",
      note: "A title-company website focused on services and quote requests.",
    },
    {
      label: "Stage Echo",
      href: "/work/stage-echo/",
      note: "A brand and website for an events and entertainment company.",
    },
    {
      label: "Mortgage websites",
      href: "/mortgage/",
      note: "15 designs for loan officers and brokers, with their own starting price.",
    },
    {
      label: "The template catalog",
      href: "/templates/",
      note: "Browse every design we can start from, each one a real, clickable site.",
    },
  ],
  faqs: [
    {
      q: "How long does a website take?",
      a: "Qualified template-based sites follow our seven-day build once we have your content, account access and approvals. Custom sites and bigger integrations get a schedule based on scope before we start.",
    },
    {
      q: "Do I own the website?",
      a: "Yes. The site is built for you and launched on your domain. Hosting and support are an optional monthly service, not rent.",
    },
    {
      q: "Can you redesign my current website?",
      a: "Yes. We can rebuild an existing site, keep what's working, and fix what isn't: structure, design, speed and how well it turns visitors into inquiries.",
    },
    {
      q: "Do you write the website copy?",
      a: "We can. Copywriting is available as an add-on, or we work from content you provide.",
    },
    {
      q: "Will my website show up on Google?",
      a: "Every build includes basic on-page SEO setup. Where you rank depends on your market, your competition and your content over time, so nobody can honestly promise a position.",
    },
    {
      q: "Can you connect the forms to my CRM?",
      a: "Yes. We can route leads into most CRMs and trigger automated follow-up, depending on the platform and its integrations.",
    },
  ],
  ctaHref: "/contact/",
  related: ["lead-funnels", "meta-ads", "custom-apps"],
};
