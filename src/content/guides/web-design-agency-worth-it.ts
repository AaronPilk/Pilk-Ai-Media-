import {
  buildTimes,
  hostingPlan,
  mortgagePackage,
  packages,
} from "@/content/packages";
import { packageName, packagePrice } from "@/content/services/pricing";
import { money, startingAtLower } from "@/lib/pricing";

/**
 * Answer-first page built from the objections small business owners raise on
 * Reddit about hiring a web designer or agency. Research notes and thread URLs:
 * docs/seo/objections-20261116.md. Rules: every price comes from packages.ts,
 * no invented stats, results, clients or testimonials, no guarantees.
 */

export type GuideSection = {
  /** Anchor id for the H2. */
  id: string;
  q: string;
  /** Paragraphs. May carry [anchor](/path/) links, rendered by InlineText. */
  answer: string[];
};

const hostingFrom = `${startingAtLower(hostingPlan.priceFrom)} a month`;

/** "$1,000", or "$250 per listing": the starting figure, for "starts at …". */
function figure(id: (typeof packages)[number]["id"]): string {
  const tier = packages.find((p) => p.id === id);
  if (!tier) throw new Error(`Unknown package ${id}`);
  return `${money(tier.price)}${tier.priceUnit ? ` ${tier.priceUnit}` : ""}`;
}

export const agencyWorthIt = {
  path: "/is-a-web-design-agency-worth-it/",
  title: "Is a Web Design Agency Worth It? An Honest Answer",
  description:
    "Straight answers to the usual objections: doing it yourself, what a website really costs, who owns it, and when you shouldn't hire anyone, us included.",
  headline: "Is hiring a web design agency worth it?",
  eyebrow: "Websites, honestly",
  author: "Aaron Pilkington",
  published: "2026-11-16",
  updated: "2026-11-16",

  /** The two-sentence answer shown first. */
  shortAnswer: [
    "For a service business that gets its customers through calls, bookings or form fills, usually yes, as long as the agency builds the site in your name, quotes in writing and sets up the parts that turn a visitor into a lead.",
    "If you're just starting out, have more time than money, or only need a simple page with your hours and phone number, building it yourself on a website builder is often the smarter move.",
  ],

  intro:
    "We read through Reddit threads where small business owners talk about hiring web designers, agencies and developers, and the same handful of complaints kept coming up. Here is each one with a straight answer. We build websites for a living, so keep that in mind, and read the part about when not to hire us before you decide.",

  sections: [
    {
      id: "diy",
      q: "Can't I just build it myself on Wix or Squarespace?",
      answer: [
        "Yes, and plenty of businesses should. Website builders are made for people who don't code, and a simple site with your services, photos, hours and a contact form is within reach if you have a few free evenings and some patience.",
        "What you're trading is time and know-how for money. Doing it yourself means you write every page, choose and size the photos, set up the forms, connect the domain and fix things when they break. Hiring someone makes sense when your hours are worth more spent on the business, or when you need things a basic setup won't give you: pages built around getting leads, a CRM connection, tracking, or a design that doesn't look like every other site on the same theme.",
        "One piece of advice we saw more than once: launch something simple yourself, start bringing in money, and pay for a proper build once you know what the business needs. That's sound advice.",
      ],
    },
    {
      id: "cost",
      q: "Why pay thousands when templates are cheap?",
      answer: [
        "A template is a design. A working business website is that design with your copy and photos loaded in, forms that actually reach you, a domain connected properly, testing on phones and browsers, and basic on-page SEO. Most of the cost is the setup and the details, not the look.",
        `Here's what we charge, so you can compare. A ${packageName("listing")} starts at ${figure("listing")}. A ${packageName("template")}, built from one of our templates, starts at ${figure("template")}. A ${packageName("custom")} starts at ${figure("custom")}, and a ${packageName("crm")} starts at ${figure("crm")}. Mortgage websites start at ${money(mortgagePackage.price)}. Hosting and support are optional, ${hostingFrom}. Those are starting points: you get a written quote before any work or payment, and nothing is sold through this site.`,
        "If someone quotes you a big number for a site built on a template, ask what the money covers beyond the design. A good answer lists specific work. A vague one is a reason to keep looking.",
      ],
    },
    {
      id: "no-leads",
      q: "What if I pay and it doesn't bring in any leads?",
      answer: [
        "This is the regret we saw most, and it's a fair one. A website doesn't create demand on its own. It turns people who already found you into calls and inquiries. If nobody is finding you, a nicer site won't fix that.",
        "People reach a site through search, ads, social media and referrals. Search takes time and depends on your market and your competition, so nobody can honestly promise you a ranking, and you should be wary of anyone who guarantees leads. If you need inquiries soon, the site usually needs traffic behind it, such as [Facebook and Instagram ads](/services/meta-ads/) or a [lead funnel with automatic follow-up](/services/lead-funnels/), and that is a separate cost to plan for.",
        "What a good build can do is make sure the people who do show up can reach you: clear pages, a site that works well on a phone, a lead form that emails you every inquiry, and tracking so you can see where leads come from.",
      ],
    },
    {
      id: "ownership",
      q: "Will the agency own my site and hold it hostage?",
      answer: [
        "It happens. Stories about a developer who controls the domain, the site or even the email accounts come up again and again. The fix costs nothing: register the domain in your own name, get admin access to the site and the hosting, and make sure the agreement says you own the finished work.",
        "With us, you own the finished website and it launches on your domain. Hosting and support are an optional monthly plan that pays for hosting, upkeep and edits, not for the right to keep your site. If you stop, you take the site with you. There's more on this in [owning your website versus renting one](/own-vs-rent/).",
      ],
    },
    {
      id: "ignored",
      q: "Will a small business like mine get ignored?",
      answer: [
        "Bigger agencies have bigger clients, and small accounts can slide to the bottom of the pile. The advice on Reddit is good: find out who you'll actually be talking to, ask how they would approach the first version, and start with a small project before a big one.",
        `Pilk.ai is run by Aaron Pilkington, and you talk to him, not an account manager passing notes along. You get a written scope before anything starts. Qualified projects on a standard template follow our [seven-day build](/process/) once we have your content, account access and approvals. Custom work gets ${buildTimes.custom}. If content or approvals arrive late, the launch date moves, and we say so up front.`,
      ],
    },
    {
      id: "generic",
      q: "Will they understand my business, or write generic copy?",
      answer: [
        "An agency that doesn't know your industry tends to write copy that could be about anyone. Ask to see live sites they've built for businesses like yours, and click through them on your phone.",
        "Much of our website work so far has been for real estate, mortgage and title businesses, and you can click through those sites on [our work page](/work/). Outside those industries, we start with a kickoff call about your customers, your offer and the questions people ask before they buy. We can write the copy as an add-on, or work from content you provide.",
      ],
    },
    {
      id: "contracts",
      q: "Am I signing up for a long contract and a fee for every change?",
      answer: [
        "Ask before you sign: how long is the contract, what's included each month, and what does a small change cost? Minimum terms and surprise charges are a common complaint.",
        "Our hosting and support plans are month to month with no long-term contract, and you can cancel anytime. Every template build includes one round of revisions. After launch, depending on how the site is built, you can edit content yourself or have us handle updates on a support plan. Extra pages, integrations and custom features are quoted on top.",
      ],
    },
  ] satisfies GuideSection[],

  comparison: {
    heading: "Doing it yourself vs. hiring us",
    columns: ["Build it yourself", "Hire Pilk.ai"] as const,
    rows: [
      {
        label: "Upfront cost",
        diy: "Your time, plus the builder's plan",
        us: `${packageName("template")} ${packagePrice("template")}, ${packageName("custom")} ${packagePrice("custom")}; written quote first`,
      },
      {
        label: "Monthly cost",
        diy: "The builder's plan, for as long as the site is live",
        us: `Optional hosting and support, ${hostingFrom}, month to month`,
      },
      {
        label: "Your time",
        diy: "All of it: writing, setup, fixes",
        us: "Content, feedback and approvals; copywriting available as an add-on",
      },
      {
        label: "Who owns it",
        diy: "Your content is yours; the site runs on the builder's platform",
        us: "You own the finished site, launched on your domain",
      },
      {
        label: "Time to launch",
        diy: "As fast as you can work on it",
        us: `${buildTimes.templateStandard[0].toUpperCase()}${buildTimes.templateStandard.slice(1)} for qualified template projects once content and approvals are in; custom work scheduled by scope`,
      },
      {
        label: "Leads, CRM, tracking",
        diy: "Whatever the builder offers and you set up",
        us: "A lead form on every build; CRM connections and tracking can be added",
      },
      {
        label: "Best for",
        diy: "New businesses, tight budgets, simple sites",
        us: "Service businesses that rely on calls, bookings and form fills",
      },
    ],
  },

  notFor: {
    id: "when-not-to-hire",
    heading: "When you shouldn't hire us (or any agency)",
    items: [
      "You haven't sold anything yet. Put up a simple page, find out what customers want, and spend on a proper site later.",
      "Your budget is below our starting prices and you have the time. A website builder will serve you better than a rushed, underfunded build.",
      "You need one page with your phone number and hours, and it won't change much.",
      "Nobody knows your business exists yet and you can only afford one thing. Spend it on getting in front of people first, then improve the site.",
      "You want a guaranteed ranking or a guaranteed number of leads. We won't promise that, and you should be careful with anyone who does.",
      "You enjoy building things and have the hours. That's a perfectly good reason to do it yourself.",
      "You can't get us content, feedback and approvals in the next few weeks. Every timeline starts once those are in, so the project would just sit.",
    ],
  },

  worthIt: {
    heading: "When it usually is worth it",
    items: [
      "One new customer is worth more to you than the cost of the build.",
      "Your current site looks dated, is hard to use on a phone, or its forms don't reliably reach you.",
      "You want new leads to land in a CRM and get an automatic reply.",
      "Your time is better spent running the business than learning a website builder.",
    ],
  },

  checklist: {
    heading: "How to hire anyone without getting burned",
    items: [
      "Register the domain in your own name and keep the login.",
      "Get admin access to the site and the hosting, even if you never use it.",
      "Get a written quote that lists the pages and features included.",
      "Ask what happens to the site if you stop paying the monthly fee.",
      "Ask who will do the work and who you'll actually talk to.",
      "Look at live sites they've built and try them on your phone.",
      "If you're unsure, start with something small.",
    ],
  },

  cta: {
    heading: "Still not sure?",
    body: "Tell us what you need and we'll give you a straight answer, even if that answer is to build it yourself for now.",
  },
};
