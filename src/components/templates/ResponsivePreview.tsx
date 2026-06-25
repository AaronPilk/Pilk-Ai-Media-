import type { WebsiteTemplate } from "@/types/template";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

/** Desktop / tablet / mobile preview frames for a template detail page. */
export function ResponsivePreview({ template }: { template: WebsiteTemplate }) {
  return (
    <div className="grid items-end gap-6 sm:grid-cols-[2fr_1fr]">
      <div className="aspect-[16/10]">
        <FauxBrowser
          accent={template.accent}
          url={`${template.slug}.pilk.ai`}
          image={template.preview.desktop}
        />
      </div>
      <div className="mx-auto w-[58%] sm:w-full" style={{ aspectRatio: "9 / 16" }}>
        <FauxBrowser
          accent={template.accent}
          url={template.slug}
          image={template.preview.mobile}
          variant="mobile"
        />
      </div>
    </div>
  );
}
