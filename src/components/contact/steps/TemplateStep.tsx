"use client";

import { TemplateSelector } from "@/components/contact/fields/TemplateSelector";

export function TemplateStep() {
  return (
    <div>
      <p className="mb-6 max-w-xl text-sm text-muted">
        Pick a starting design to build from, choose fully custom, or decide later. You can change
        this anytime — it just gives us a head start.
      </p>
      <TemplateSelector />
    </div>
  );
}
