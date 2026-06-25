import { create } from "zustand";

export type SceneChapter =
  | "hero"
  | "positioning"
  | "showcase"
  | "templates"
  | "process"
  | "contact";

type ExperienceState = {
  chapter: SceneChapter;
  globalProgress: number;
  heroProgress: number;
  pointer: { x: number; y: number };
  ready: boolean;
  setChapter: (chapter: SceneChapter) => void;
  setGlobalProgress: (progress: number) => void;
  setHeroProgress: (progress: number) => void;
  setPointer: (x: number, y: number) => void;
  setReady: (ready: boolean) => void;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const useExperienceStore = create<ExperienceState>((set) => ({
  chapter: "hero",
  globalProgress: 0,
  heroProgress: 0,
  pointer: { x: 0, y: 0 },
  ready: false,

  setChapter: (chapter) => set({ chapter }),

  setGlobalProgress: (globalProgress) =>
    set({ globalProgress: clamp01(globalProgress) }),

  setHeroProgress: (heroProgress) =>
    set({
      heroProgress: clamp01(heroProgress),
      chapter: heroProgress >= 0.95 ? "positioning" : "hero",
    }),

  setPointer: (x, y) =>
    set({
      pointer: {
        x: Math.min(1, Math.max(-1, x)),
        y: Math.min(1, Math.max(-1, y)),
      },
    }),

  setReady: (ready) => set({ ready }),
}));
