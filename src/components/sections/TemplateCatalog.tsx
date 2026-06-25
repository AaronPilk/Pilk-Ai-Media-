"use client";

import { useMemo, useState } from "react";
import { templates } from "@/content/templates";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateFilters, type FilterValue } from "@/components/templates/TemplateFilters";

export function TemplateCatalog({
  index = "04",
  heading = "Browse the catalog.",
  initialFilter = "all",
}: {
  index?: string;
  heading?: string;
  initialFilter?: FilterValue;
}) {
  const [filter, setFilter] = useState<FilterValue>(initialFilter);

  const filtered = useMemo(
    () => (filter === "all" ? templates : templates.filter((t) => t.category === filter)),
    [filter]
  );

  return (
    <section className="section relative z-10">
      <Container>
        <SectionLabel index={index}>Templates</SectionLabel>
        <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
          {heading}
        </h2>

        <div className="mt-10">
          <TemplateFilters active={filter} onChange={setFilter} />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>

        <p className="mt-8 max-w-xl text-xs text-muted">{site.pricingDisclaimer}</p>
      </Container>
    </section>
  );
}
