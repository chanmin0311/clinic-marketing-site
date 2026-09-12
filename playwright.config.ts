import { defineConfig, devices } from "@playwright/test";

// contexts/testing.md — e2e runs against the static build output (out/),
// never the dev server.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run build && npx serve out -l 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
