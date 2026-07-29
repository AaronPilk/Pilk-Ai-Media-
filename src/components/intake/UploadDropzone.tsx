"use client";

import { useCallback, useRef, useState } from "react";
import { INTAKE_MAX_FILE_SIZE } from "@/lib/template-intake-schema";

export type UploadItem = {
  localId: string;
  file: File;
  previewUrl?: string; // undefined for pdf / undecodable (e.g. HEIC)
  isPdf: boolean;
};

type Props = {
  title: string;
  helper: string;
  skipLine: string;
  multiple?: boolean;
  items: UploadItem[];
  onItemsChange: (next: UploadItem[]) => void;
  onSoftError: (msg: string) => void;
  error?: string;
};

const ACCEPT = "image/*,application/pdf,.heic,.heif";

export function UploadDropzone({
  title,
  helper,
  skipLine,
  multiple = false,
  items,
  onItemsChange,
  onSoftError,
  error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return;
      const next: UploadItem[] = [];
      for (const raw of Array.from(fileList)) {
        const okType =
          raw.type.startsWith("image/") ||
          raw.type === "application/pdf" ||
          /\.(heic|heif)$/i.test(raw.name);
        if (!okType) {
          onSoftError("That file type won't work here. Try a photo (like from your phone) or a PDF.");
          continue;
        }
        if (raw.size > INTAKE_MAX_FILE_SIZE) {
          onSoftError(`"${raw.name}" is over 8 MB — try a smaller version, or email it to us later.`);
          continue;
        }
        const isPdf = raw.type === "application/pdf";
        let previewUrl: string | undefined;
        if (!isPdf) {
          try {
            previewUrl = URL.createObjectURL(raw);
          } catch {
            previewUrl = undefined;
          }
        }
        next.push({ localId: crypto.randomUUID(), file: raw, previewUrl, isPdf });
      }
      if (next.length) onItemsChange(multiple ? [...items, ...next] : next.slice(0, 1));
      if (inputRef.current) inputRef.current.value = "";
    },
    [items, multiple, onItemsChange, onSoftError]
  );

  const remove = (localId: string) => {
    const it = items.find((i) => i.localId === localId);
    if (it?.previewUrl) URL.revokeObjectURL(it.previewUrl);
    onItemsChange(items.filter((i) => i.localId !== localId));
  };

  const filled = items.length > 0;

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`block min-h-[120px] w-full cursor-pointer rounded-sm border border-dashed p-4 transition ${
          drag ? "border-accent bg-[color:var(--accent-soft)]" : "border-line bg-surface"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className="text-sm font-medium text-ink">{title}</div>
        <p className="mt-1 text-xs text-muted">{drag ? "Drop to add" : helper}</p>

        {filled && (
          <div className="mt-3 flex flex-wrap gap-2">
            {items.map((i) => (
              <div
                key={i.localId}
                className="relative h-16 w-16 overflow-hidden rounded-sm border border-line bg-surface"
              >
                {i.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.previewUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center px-1 text-center">
                    <span className="text-[10px] font-medium text-ink">{i.isPdf ? "PDF" : "Photo"}</span>
                    <span className="text-[9px] text-muted">added</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    remove(i.localId);
                  }}
                  aria-label="Remove file"
                  className="absolute right-0.5 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  ✕
                </button>
              </div>
            ))}
            {multiple && (
              <span className="flex h-16 w-16 items-center justify-center rounded-sm border border-dashed border-line text-xs text-muted">
                + Add
              </span>
            )}
          </div>
        )}

        {filled && <p className="mt-2 text-xs text-accent">Got it — looks good.</p>}
      </label>

      <p className="mt-1.5 text-xs text-muted">{skipLine}</p>
      {error && (
        <p role="alert" className="mt-1 text-xs text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
