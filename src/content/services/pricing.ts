import { packages, hostingPlan } from "@/content/packages";
import { startingAtLower } from "@/lib/pricing";

// Service pages quote prices from packages.ts instead of repeating numbers, so
// a price change in one place cannot leave a stale figure on another page.
// Every figure is a starting point; the quote sets the price.
export function packagePrice(id: (typeof packages)[number]["id"]): string {
  const tier = packages.find((p) => p.id === id);
  if (!tier) throw new Error(`Unknown package ${id}`);
  return startingAtLower(tier.price, tier.priceUnit);
}

export function packageName(id: (typeof packages)[number]["id"]): string {
  const tier = packages.find((p) => p.id === id);
  if (!tier) throw new Error(`Unknown package ${id}`);
  return tier.name;
}

export const hostingPrice = `${hostingPlan.availability.toLowerCase()}, ${startingAtLower(hostingPlan.priceFrom)}${hostingPlan.priceSuffix}`;
