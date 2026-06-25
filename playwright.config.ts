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
    command: "npm run build && npm run preview",
    url: "http://localhost:8788",
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
