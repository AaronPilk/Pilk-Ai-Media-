"use client";

import { packages, hostingPlan, optionalUpgrades } from "@/content/packages";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section
      className="section relative z-10 overflow-hidden bg-[#0a0a0b]"
      id="pricing"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(10,10,11,0.9), rgba(10,10,11,0.96)), url('/brand/brand-automation.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <SectionLabel index="07">Pricing</SectionLabel>
        <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
          Start with a template, or build from zero.
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                "flex flex-col rounded-md border p-8 transition-colors",
                pkg.mostPopular
                  ? "border-accent bg-[color:var(--accent-soft)]"
                  : "border-line bg-surface"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium">{pkg.name}</h3>
                {pkg.mostPopular && (
                  <span className="rounded-full bg-accent px-3 py-1 text-xs text-white">
                    Most Popular
                  </span>
                )}
              </div>

              <p className="mt-4 font-display text-3xl font-semibold">{pkg.priceLabel}</p>
              <p className="mt-2 text-sm text-muted">{pkg.summary}</p>

              <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                {pkg.features.map((f) => (
                  <li key={f} className="flex gap-2 text-muted">
                    <span className="text-accent">—</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  href={pkg.cta.href}
                  variant={pkg.mostPopular ? "primary" : "ghost"}
                  withArrow
                  onClick={() => trackEvent("pricing_package_clicked", { package: pkg.id })}
                >
                  {pkg.cta.label}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-6 rounded-md border border-line bg-surface p-8 md:flex-row md:items-center md:justify-between">
          <div className="md:max-w-xl">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-medium">{hostingPlan.name}</h3>
              <span className="font-display text-2xl font-semibold">
                {hostingPlan.priceLabel}
                <span className="text-base text-muted">{hostingPlan.priceSuffix}</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">{hostingPlan.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {hostingPlan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-accent">—</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0">
            <Button
              href={hostingPlan.cta.href}
              variant="ghost"
              withArrow
              onClick={() => trackEvent("pricing_package_clicked", { package: "hosting" })}
            >
              {hostingPlan.cta.label}
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <span className="eyebrow mr-2">Optional upgrades</span>
          {optionalUpgrades.map((u) => (
            <span key={u} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
              {u}
            </span>
          ))}
        </div>

        <p className="mt-6 max-w-xl text-xs text-muted">{site.pricingDisclaimer}</p>
      </Container>
    </section>
  );
}
