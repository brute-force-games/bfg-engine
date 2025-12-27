import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddConfig = defineBddConfig({
  features: ['tests-gherkin/features/**/*.feature'],
  steps: [
    'tests-gherkin/step-definitions/cli-steps.ts',
    'tests-gherkin/step-definitions/web-cli-steps.ts',
  ],
  // TypeScript support - Playwright handles TS natively, but we need tsx for step definitions
  require: ['tsx/esm'],
});

export default defineConfig({
  testDir: '.features-gen',
  /* Exclude vitest to avoid conflicts */
  testIgnore: ['**/node_modules/**', '**/tests/**/*.test.ts', '**/tests/**/*.spec.ts'],
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:62776',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Web server must be started manually with: npm run web-cli */
  /* Access at: http://localhost:62776/src/cli/web-cli.html */
});

