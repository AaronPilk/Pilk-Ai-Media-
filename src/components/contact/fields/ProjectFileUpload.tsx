"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import {
  ALLOWED_UPLOAD_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
} from "@/lib/project-brief-schema";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProjectFileUpload({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setError("");
    const next = [...files];

    for (const file of Array.from(incoming)) {
      if (next.length >= MAX_FILES) {
        setError(`You can upload up to ${MAX_FILES} files.`);
        break;
      }
      if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
        setError(`${file.name} is not an accepted type (images and PDF only).`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} is larger than 15 MB.`);
        continue;
      }
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      next.push(file);
    }

    const total = next.reduce((sum, f) => sum + f.size, 0);
    if (total > MAX_TOTAL_SIZE) {
      setError("The combined upload is larger than 60 MB.");
      return;
    }

    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeAt = (index: number) => {
    setError("");
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed border-line bg-surface px-6 py-10 text-center text-sm text-muted transition-colors hover:border-ink/30"
      >
        <Upload size={18} aria-hidden />
        Add logo, brand guide, photos, or PDFs
        <span className="text-xs opacity-70">
          Images & PDF · up to {MAX_FILES} files · 15 MB each
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ALLOWED_UPLOAD_TYPES.join(",")}
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {error && <p className="mt-3 text-xs text-accent">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-sm border border-line px-4 py-2.5 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <span className="ml-4 flex items-center gap-3 text-muted">
                <span className="text-xs">{formatSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label={`Remove ${file.name}`}
                  className="rounded-full border border-line p-1 hover:text-ink"
                >
                  <X size={12} aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
