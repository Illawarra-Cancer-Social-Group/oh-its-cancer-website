/*
  Playwright settings for the accessibility and smoke tests in tests/.

  The tests run against the built site (the dist/ folder), served by
  "astro preview". Run "npm run check" to build and test in one go.
*/
import { defineConfig, devices } from '@playwright/test';

// Not 4321 (the "npm run dev" port), so the tests never check a dev server by mistake
const PORT = 4329;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // On GitHub, stop if someone left test.only in the code by mistake
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: `http://localhost:${PORT}`,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Serve the built site while the tests run.
  // --ignore-lock keeps the server in the foreground. Without it, Astro moves
  // itself to the background when an AI tool runs it, and Playwright thinks it crashed.
  webServer: {
    command: `npx astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}`,
    // Always start a fresh server, so the tests check the build that just ran
    reuseExistingServer: false,
  },
});
