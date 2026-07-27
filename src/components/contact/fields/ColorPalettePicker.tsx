"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ProjectBriefInput } from "@/lib/project-brief-schema";
import { projectPalettes } from "@/components/contact/project-palettes";
import { cn } from "@/lib/utils";

const HEX = /^#[0-9a-fA-F]{6}$/;

/** Free-typing hex field that only commits to the form when a full valid hex is entered. */
function HexInput({ value, onCommit }: { value: string; onCommit: (v: string) => void }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  return (
    <input
      type="text"
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      value={text}
      placeholder="#000000"
      onChange={(e) => {
        const v = e.target.value;
        setText(v);
        if (HEX.test(v)) onCommit(v);
      }}
      className="w-[92px] rounded-sm border border-line bg-surface px-2 py-1 text-center text-xs focus:border-accent"
      aria-label="Hex color code"
    />
  );
}

export function ColorPalettePicker() {
  const { watch, setValue, register } = useFormContext<ProjectBriefInput>();
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
                  <span key={c} className="h-8 flex-1 rounded" style={{ background: c }} />
                ))}
              </div>
              <span className="mt-3 block text-sm font-medium">{palette.name}</span>
            </button>
          );
        })}
      </div>

      {/* Type your colors by name */}
      <div className="mt-6">
        <label htmlFor="colorNotes" className="mb-2 block text-sm text-muted">
          Have specific colors in mind? Type them by name
        </label>
        <input
          id="colorNotes"
          type="text"
          placeholder="e.g. navy blue, warm gold, cream — or a brand color"
          className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm placeholder:text-muted focus:border-accent"
          {...register("colorNotes")}
        />
      </div>

      {/* Or apply exact hex codes */}
      <div className="mt-5">
        <p className="mb-3 text-sm text-muted">…or pick / paste exact color codes</p>
        <div className="flex flex-wrap gap-5">
          {swatches.map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <input
                type="color"
                value={HEX.test(color) ? color : "#000000"}
                onChange={(e) => setColorAt(i, e.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-line bg-transparent"
                aria-label={`Color ${i + 1} picker`}
              />
              <HexInput value={color} onCommit={(v) => setColorAt(i, v)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
