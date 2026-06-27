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
          image={template.preview.desktop}
        />
      </div>
      <div
        className="mx-auto hidden w-[58%] sm:block sm:w-full"
        style={{ aspectRatio: "9 / 16" }}
      >
        <TemplateLivePreview
          liveUrl={template.liveUrl}
          accent={template.accent}
          slug={template.slug}
          device="mobile"
          image={template.preview.mobile ?? template.preview.desktop}
        />
      </div>
    </div>
  );
}
