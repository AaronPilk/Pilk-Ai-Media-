/** Feature flags. Flip these on when a feature is ready for the main flow. */
export const features = {
  interactiveLab: false,
  soundMode: false,
  // Live template previews load the real template site in an iframe / new tab.
  projectIframes: true,
} as const;

export type FeatureFlags = typeof features;
