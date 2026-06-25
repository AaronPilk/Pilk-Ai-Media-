"use client";

import { useFormContext } from "react-hook-form";
import type { ProjectBriefInput } from "@/lib/project-brief-schema";
import { projectPalettes } from "@/components/contact/project-palettes";
import { cn } from "@/lib/utils";

export function ColorPalettePicker() {
  const { watch, setValue } = useFormContext<ProjectBriefInput>();
  const selectedPalette = watch("selectedPalette");
  const colors = (watch("preferredColors") as string[] | undefined) ?? [];

  const choosePalette = (id: string, paletteColors: string[]) => {
    setValue("selectedPalette", id, { shouldDirty: true });
    setValue("preferredColors", paletteColors, { shouldDirty: true });
  };

  const setColorAt = (index: number, value: string) => {
    const next = [...colors];
    while (next.length <= index) next.push("#000000");
    next[index] = value;
    setValue("preferredColors", next, { shouldDirty: true });
    setValue("selectedPalette", "custom", { shouldDirty: true });
  };

  const swatches = colors.length ? colors.slice(0, 4) : ["#0a0a0b", "#7c3aed", "#c4b5fd", "#ffffff"];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {projectPalettes.map((palette) => {
          const active = selectedPalette === palette.id;
          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => choosePalette(palette.id, palette.colors)}
              aria-pressed={active}
              className={cn(
                "rounded-md border p-4 text-left transition-colors",
                active ? "border-accent bg-[color:var(--accent-soft)]" : "border-line hover:border-ink/30"
              )}
            >
              <div className="flex gap-1.5">
                {palette.colors.map((c) => (
                  <span
                    key={c}
                    className="h-8 flex-1 rounded"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span className="mt-3 block text-sm font-medium">{palette.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm text-muted">Fine-tune colors (optional)</p>
        <div className="flex flex-wrap gap-4">
          {swatches.map((color, i) => (
            <label key={i} className="flex flex-col items-center gap-1 text-xs text-muted">
              <input
                type="color"
                value={color}
                onChange={(e) => setColorAt(i, e.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-line bg-transparent"
                aria-label={`Color ${i + 1}`}
              />
              <span>{color}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
