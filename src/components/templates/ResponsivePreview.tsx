import type { WebsiteTemplate } from "@/types/template";
import { TemplateLivePreview } from "@/components/templates/TemplateLivePreview";

/** Desktop / tablet / mobile preview frames for a template detail page. */
export function ResponsivePreview({ template }: { template: WebsiteTemplate }) {
  return (
    <div className="grid items-end gap-6 sm:grid-cols-[2fr_1fr]">
      <div className="aspect-[16/10]">
        <TemplateLivePreview
          liveUrl={template.liveUrl}
          accent={template.accent}
          slug={template.slug}
        />
      </div>
      <div className="mx-auto w-[58%] sm:w-full" style={{ aspectRatio: "9 / 16" }}>
        <TemplateLivePreview
          liveUrl={template.liveUrl}
          accent={template.accent}
          slug={template.slug}
          device="mobile"
        />
      </div>
    </div>
  );
}
