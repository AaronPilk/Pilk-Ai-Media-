import { create } from "zustand";

export type SceneChapter =
  | "hero"
  | "structure"
  | "work"
  | "templates"
  | "process"
  | "contact";

type ExperienceState = {
  chapter: SceneChapter;
  globalProgress: number;
  pointer: { x: number; y: number };
  ready: boolean;
  setChapter: (chapter: SceneChapter) => void;
  setGlobalProgress: (progress: number) => void;
  setPointer: (x: number, y: number) => void;
  setReady: (ready: boolean) => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  chapter: "hero",
  globalProgress: 0,
  pointer: { x: 0, y: 0 },
  ready: false,
  setChapter: (chapter) => set({ chapter }),
  setGlobalProgress: (globalProgress) =>
    set({ globalProgress: Math.min(1, Math.max(0, globalProgress)) }),
  setPointer: (x, y) =>
    set({
      pointer: {
        x: Math.min(1, Math.max(-1, x)),
        y: Math.min(1, Math.max(-1, y)),
      },
    }),
  setReady: (ready) => set({ ready }),
}));
