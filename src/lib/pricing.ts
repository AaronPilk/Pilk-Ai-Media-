/**
 * How a price is allowed to appear on pilk.ai. Nothing is sold online: every
 * project starts with a written quote and an invoice, so the site only ever
 * shows the lowest figure a package starts at. Every label goes through these
 * helpers so no page can slip back to a fixed "flat" price.
 */

export function money(dollars: number): string {
  return `$${dollars.toLocaleString("en-US")}`;
}

/** "Starting at $1,000", or "Starting at $250 per listing" with a unit. */
export function startingAt(dollars: number, unit?: string): string {
  return `Starting at ${money(dollars)}${unit ? ` ${unit}` : ""}`;
}

/** The same label for use mid-sentence: "starting at $1,000". */
export function startingAtLower(dollars: number, unit?: string): string {
  return `starting at ${money(dollars)}${unit ? ` ${unit}` : ""}`;
}

/** Shown wherever a package has no published starting figure. */
export const QUOTED_PER_PROJECT = "Quoted per project";

/** One line used under prices and on the legal pages. */
export const QUOTE_ONLY_NOTE =
  "Prices are starting points. Every project gets a written quote first, and work starts once you approve it and pay the invoice. Nothing is sold through this site.";
