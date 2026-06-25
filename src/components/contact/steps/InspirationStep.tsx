"use client";

import { InspirationUrls } from "@/components/contact/fields/InspirationUrls";
import { ProjectFileUpload } from "@/components/contact/fields/ProjectFileUpload";

export function InspirationStep({
  files,
  onFilesChange,
}: {
  files: File[];
  onFilesChange: (files: File[]) => void;
}) {
  return (
    <div className="grid gap-10">
      <div>
        <p className="mb-4 text-sm text-muted">
          Show us up to five websites you like and what stands out about each.
        </p>
        <InspirationUrls />
      </div>

      <div>
        <p className="mb-4 text-sm text-muted">
          Add any materials you already have — logo, brand guide, photos, or content (optional).
        </p>
        <ProjectFileUpload files={files} onChange={onFilesChange} />
      </div>
    </div>
  );
}
