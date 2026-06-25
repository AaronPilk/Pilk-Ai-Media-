export type BuiltSite = {
  slug: string;
  name: string;
  /** Use "Client Build" only for real, approved client work. */
  label: "Client Build" | "Concept Build" | "Internal Build" | "Coming Soon";
  industry: string;
  summary: string;
  year?: string;
  accent: string;
  liveUrl?: string;
  sourceFolder?: string;
  assets: {
    desktop?: string;
    mobile?: string;
    video?: string;
    poster?: string;
  };
  services: string[];
};
