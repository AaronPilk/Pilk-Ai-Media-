"use client";

import { useState } from "react";
import type { WebsiteTemplate } from "@/types/template";
import { Button } from "@/components/ui/Button";
import { TemplatePreviewModal } from "@/components/templates/TemplatePreviewModal";
import { trackEvent } from "@/lib/analytics";

export function TemplatePreviewButton({ template }: { template: WebsiteTemplate }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          setOpen(true);
          trackEvent("template_preview_opened", { template: template.slug });
        }}
        data-cursor="open"
      >
        Live preview
      </Button>
      <TemplatePreviewModal template={template} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
