import { packages, hostingPlan } from "@/content/packages";
import { formatPrice } from "@/lib/utils";

// Service pages quote prices from packages.ts instead of repeating numbers, so
// a price change in one place cannot leave a stale figure on another page.
export function packagePrice(id: (typeof packages)[number]["id"]): string {
  const tier = packages.find((p) => p.id === id);
  if (!tier) throw new Error(`Unknown package ${id}`);
  return `$${formatPrice(tier.price)}`;
}

export function packageName(id: (typeof packages)[number]["id"]): string {
  const tier = packages.find((p) => p.id === id);
  if (!tier) throw new Error(`Unknown package ${id}`);
  return tier.name;
}

export const hostingPrice = `${hostingPlan.priceLabel}${hostingPlan.priceSuffix}`;
