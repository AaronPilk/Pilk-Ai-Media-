import type { Project } from "@/types/project";

/**
 * Featured work. These are CONCEPTS until real client work is supplied.
 * When a project launches, change `label` to "Client Project" / "Case Study"
 * and add a real `cover` image + `liveUrl`.
 */
export const projects: Project[] = [
  {
    slug: "luxury-agent",
    name: "Luxury Agent",
    label: "Concept",
    category: "Luxury Real Estate",
    year: "Concept",
    accent: "#9d6bff",
    summary: "An editorial personal brand built around a single high-end agent and their listings.",
    services: ["Design", "Development", "Conversion"],
  },
  {
    slug: "coastal-brokerage",
    name: "Coastal Brokerage",
    label: "Concept",
    category: "Brokerage",
    year: "Concept",
    accent: "#6d5bd0",
    summary: "A team-first brokerage experience with rosters, listings, and recruiting.",
    services: ["Design", "Development", "Integrations"],
  },
  {
    slug: "modern-title",
    name: "Modern Title",
    label: "Concept",
    category: "Title",
    year: "Concept",
    accent: "#5b54c9",
    summary: "A credible, fast title-company site focused on quotes and services.",
    services: ["Design", "Development"],
  },
  {
    slug: "architectural-group",
    name: "Architectural Group",
    label: "Concept",
    category: "Local Business",
    year: "Concept",
    accent: "#7c3aed",
    summary: "A portfolio-led studio site where the work is the hero.",
    services: ["Design", "Development", "Motion"],
  },
  {
    slug: "private-lending",
    name: "Private Lending",
    label: "Concept",
    category: "Mortgage",
    year: "Concept",
    accent: "#8b5cf6",
    summary: "A confident lending brand with programs and a clean application path.",
    services: ["Design", "Development", "Conversion"],
  },
  {
    slug: "new-development",
    name: "New Development",
    label: "Concept",
    category: "Real Estate",
    year: "Concept",
    accent: "#a78bfa",
    summary: "A launch site for a new development — renderings, availability, and inquiries.",
    services: ["Design", "Development", "Motion"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
