export type TemplateCategory =
  | "agent"
  | "luxury-agent"
  | "brokerage"
  | "mortgage"
  | "title"
  | "local-business"
  | "custom";

export type TemplateLabel = "Template" | "Premium Template" | "Concept" | "Custom";

export type WebsiteTemplate = {
  slug: string;
  name: string;
  category: TemplateCategory;
  label: TemplateLabel;
  shortDescription: string;
  /** Accent used by the procedural preview + detail page. */
  accent: string;
  price: number;
  pages: number;
  timeline: string;
  featured: boolean;
  preview: {
    /** Optional real screenshots — when absent, a procedural preview renders. */
    desktop?: string;
    tablet?: string;
    mobile?: string;
    video?: string;
    poster?: string;
  };
  features: string[];
  upgrades: string[];
  liveUrl?: string;
};
