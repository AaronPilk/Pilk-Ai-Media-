import type { Metadata } from "next";
import { site } from "@/content/site";
import { faq } from "@/content/faq";
import {
  serviceCatalog,
  type Service,
  type ServiceCard,
} from "@/content/services";

const base = site.url;

/** 1200x630 share card made for this site; used when a page has no better image. */
export const DEFAULT_OG = {
  url: "/og/pilk-ai-og.jpg",
  width: 1200,
  height: 630,
  alt: "Pilk.ai: websites, apps and AI consulting in St. Petersburg, Florida",
};

const ORG_ID = `${base}/#organization`;
const WEBSITE_ID = `${base}/#website`;
const FOUNDER_ID = `${base}/#founder`;

const TITLE_SUFFIX = ` · ${site.entity.name}`;
const MAX_DESCRIPTION = 155;

/**
 * The site exports with trailingSlash: true, so Cloudflare serves /work/ and
 * 308-redirects /work. Every URL we hand to search engines must be the
 * slash form or it points at a redirect.
 */
export function absoluteUrl(path = "/"): string {
  const [pathname, hash] = path.split("#");
  const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${base}${withSlash}${hash ? `#${hash}` : ""}`;
}

function clampDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_DESCRIPTION) return clean;
  const cut = clean.slice(0, MAX_DESCRIPTION - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}

export function buildMetadata({
  title,
  absoluteTitle,
  description,
  path = "/",
  image,
  noindex = false,
}: {
  /** Page title; the brand suffix is added. */
  title?: string;
  /** Full title used as-is (home page). */
  absoluteTitle?: string;
  description?: string;
  path?: string;
  /** Path under /public or an absolute URL. */
  image?: string;
  /** Utility pages (checkout, intake forms, expired promos) stay out of search. */
  noindex?: boolean;
}): Metadata {
  const fullTitle =
    absoluteTitle ?? (title ? `${title}${TITLE_SUFFIX}` : site.seo.homeTitle);
  const desc = clampDescription(description ?? site.seo.description);
  const url = absoluteUrl(path);
  const ogImage = image
    ? {
        url: image.startsWith("http") ? image : `${base}${image}`,
        alt: fullTitle,
      }
    : { ...DEFAULT_OG, url: `${base}${DEFAULT_OG.url}` };

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(base),
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: site.entity.name,
      locale: "en_US",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage.url],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Structured data. One entity graph on every page, page nodes on top. */
/* ------------------------------------------------------------------ */

type Node = Record<string, unknown>;

const areaServed = [
  {
    "@type": "City",
    name: "St. Petersburg",
    containedInPlace: { "@type": "State", name: "Florida" },
  },
  {
    "@type": "Place",
    name: "Tampa Bay, Florida",
  },
];

function serviceId(card: Pick<ServiceCard, "href">) {
  return `${absoluteUrl(card.href)}#service`;
}

function organizationNode(): Node {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: site.entity.name,
    legalName: site.entity.legalName,
    alternateName: site.entity.alternateName,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      "@id": `${base}/#logo`,
      url: `${base}/brand/pilk-ai-logo-512.png`,
      width: 512,
      height: 512,
      caption: site.entity.name,
    },
    image: { "@id": `${base}/#logo` },
    description: site.seo.description,
    email: site.contact.email,
    telephone: site.contact.phoneE164,
    // City-level only. The street address is private and is never published.
    address: {
      "@type": "PostalAddress",
      addressLocality: site.entity.locality,
      addressRegion: site.entity.region,
      addressCountry: site.entity.country,
    },
    areaServed,
    founder: { "@id": FOUNDER_ID },
    sameAs: site.profiles.map((p) => p.href),
    knowsAbout: serviceCatalog.map((s) => s.serviceType),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${site.entity.name} services`,
      itemListElement: serviceCatalog.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": serviceId(s),
          name: s.name,
          url: absoluteUrl(s.href),
        },
      })),
    },
  };
}

function founderNode(): Node {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: site.entity.founder,
    jobTitle: "Founder",
    worksFor: { "@id": ORG_ID },
  };
}

function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: site.entity.name,
    alternateName: site.entity.alternateName,
    inLanguage: "en-US",
    publisher: { "@id": ORG_ID },
  };
}

/** Rendered once in the root layout. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), founderNode(), websiteNode()],
  };
}

/** Home is added automatically; pass the trail below it. */
export function breadcrumbNode(items: { name: string; path: string }[]): Node {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqNode(items: { q: string; a: string }[]): Node {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function serviceNode(
  service: Pick<Service, "href" | "name" | "serviceType"> & {
    description: string;
  }
): Node {
  return {
    "@type": "Service",
    "@id": serviceId(service),
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    url: absoluteUrl(service.href),
    provider: { "@id": ORG_ID },
    areaServed,
  };
}

export function itemListNode(cards: ServiceCard[]): Node {
  return {
    "@type": "ItemList",
    itemListElement: cards.map((card, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: card.name,
      url: absoluteUrl(card.href),
    })),
  };
}

/** Wraps page-level nodes in one document; the org is referenced, not repeated. */
export function pageGraph(...nodes: Node[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** The shared FAQ shown on the home page and /real-estate/. */
export function siteFaqNode(): Node {
  return faqNode(faq);
}

export function mortgageServiceNode(): Node {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl("/mortgage/")}#service`,
    name: "Mortgage Website Design & Build",
    serviceType: "Website design for mortgage professionals",
    provider: { "@id": ORG_ID },
    url: absoluteUrl("/mortgage/"),
    description:
      "15 fully built mortgage website templates for loan officers, brokers, and brokerages. $500 one-time build plus $100/mo hosting and support.",
    offers: {
      "@type": "Offer",
      price: "500",
      priceCurrency: "USD",
      description: "$500 one-time build plus $100/mo hosting and support",
    },
  };
}
