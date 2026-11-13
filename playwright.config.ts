import { defineConfig, devices } from "@playwright/test";

/**
 * Tests run against the REAL exported Cloudflare build (wrangler pages dev),
 * so /api/leads and routing behave like production. Default wrangler port: 8788.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:8788",
    trace: "on-first-retry",
  },
  webServer: {
    // The suite sends more leads from one IP than the per-IP form limit
    // (wrangler.toml FORM_RATE_LIMIT_MAX) allows, so the preview lifts it.
    // The limit itself is covered by scripts/test-functions.mjs, and the 429
    // message in the forms by e2e/lead-forms.spec.ts.
    command: "npm run build && npx wrangler pages dev out --binding FORM_RATE_LIMIT_MAX=1000",
    url: "http://localhost:8788",
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
