export type ProjectLabel = "Client Project" | "Case Study" | "Concept";

export type Project = {
  slug: string;
  name: string;
  /** Use "Client Project" / "Case Study" only for real, launched work. */
  label: ProjectLabel;
  category: string;
  year: string;
  summary: string;
  accent: string;
  /** Optional real imagery — procedural preview renders when absent. */
  cover?: string;
  liveUrl?: string;
  services?: string[];
};
