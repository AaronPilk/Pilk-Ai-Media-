import type { Metadata } from "next";
import { site } from "@/content/site";
import { faq } from "@/content/faq";

const base = site.url;
const DEFAULT_OG = "/pilk-logo-dark.png";

export function buildMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_OG,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} — ${site.tagline}`;
  const desc = description ?? site.description;
  const url = `${base}${path}`;
  const ogImage = image.startsWith("http") ? image : `${base}${image}`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(base),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: site.name,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.contact.email,
    logo: `${base}/pilk-logo-dark.png`,
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    description: site.description,
    areaServed: site.location,
    serviceType: "Web design and development",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  };
}

export function mortgageServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mortgage Website Design & Build",
    serviceType: "Website design for mortgage professionals",
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: "United States",
    description:
      "15 fully built mortgage website templates for loan officers, brokers, and brokerages — $500 one-time plus $100/mo hosting, GoHighLevel connected.",
    offers: {
      "@type": "Offer",
      price: "500",
      priceCurrency: "USD",
      description: "$500 one-time build plus $100/mo hosting and support",
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}
