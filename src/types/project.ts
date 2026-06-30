export type Project = {
  slug: string;
  name: string;
  /** Short tag shown on the card, e.g. "Client Build", "App Build". */
  label: string;
  category: string;
  year: string;
  summary: string;
  accent: string;
  /** Real cover image (screenshot/photo). Procedural preview renders when absent. */
  cover?: string;
  liveUrl?: string;
  services?: string[];
  /** Optional project cost to display, e.g. "$75,000". */
  cost?: string;
  /** Label shown before the cost (default "Project cost"). e.g. "App build". */
  costLabel?: string;
};
