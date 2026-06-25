export type ProjectPalette = {
  id: string;
  name: string;
  colors: string[];
};

export const projectPalettes: ProjectPalette[] = [
  {
    id: "midnight-violet",
    name: "Midnight Violet",
    colors: ["#09090B", "#6D28D9", "#C4B5FD", "#F8FAFC"],
  },
  {
    id: "editorial-neutral",
    name: "Editorial Neutral",
    colors: ["#111111", "#E7E1D7", "#A69F94", "#FFFFFF"],
  },
  {
    id: "coastal-luxury",
    name: "Coastal Luxury",
    colors: ["#0E2A35", "#C5A46D", "#E8E1D5", "#FAFAF8"],
  },
  {
    id: "modern-monochrome",
    name: "Modern Monochrome",
    colors: ["#050505", "#444444", "#B8B8B8", "#FFFFFF"],
  },
];

export const styleKeywordOptions = [
  "Sleek",
  "Premium",
  "Trustworthy",
  "Energetic",
  "Calm",
  "Editorial",
  "Futuristic",
  "Warm",
  "Bold",
  "Refined",
];
