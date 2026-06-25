/** Feature flags. Flip these on when a feature is ready for the main flow. */
export const features = {
  interactiveLab: false,
  soundMode: false,
  projectIframes: false,
} as const;

export type FeatureFlags = typeof features;
