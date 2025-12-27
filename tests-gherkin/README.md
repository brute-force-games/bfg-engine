# BDD Tests with Playwright

This directory contains Behavior-Driven Development (BDD) tests using Gherkin feature files that run via Playwright using `playwright-bdd`.

## Structure

- `features/` - Gherkin feature files (.feature)
- `step-definitions/` - TypeScript step definition files
- `.features-gen/` - Generated Playwright test files (auto-generated, do not edit)

## Running Tests

### Prerequisites
1. **Build the project first:**
   ```bash
   npm run build
   ```

2. **Generate test files from Gherkin:**
   ```bash
   npx bddgen test
   ```

### Run All BDD Tests
```bash
npm run test:bdd
```
This generates test files and runs all feature files.

### Run CLI User Management Tests Only
```bash
npm run test:bdd:cli
```
This runs only the CLI feature file (tagged with `@cli`).

### Run Web CLI User Management Tests Only
```bash
npm run test:bdd:web
```
This runs only the web CLI feature file (tagged with `@web`). **You must start the web server manually first:**

```bash
npm run web-cli
```

Then access the web CLI at: **http://localhost:62776/src/cli/web-cli.html**

The tests will connect to the server you started.

## How It Works

1. **Feature Files**: Written in Gherkin syntax (`.feature` files)
2. **Step Definitions**: TypeScript files that implement the steps using `playwright-bdd`
3. **Test Generation**: `playwright-bdd` generates Playwright test files from Gherkin
4. **Test Execution**: Playwright runs the generated tests

## Step Definitions

Step definitions use `playwright-bdd`'s API:

```typescript
import { createBdd, test } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

// CLI steps (no page needed)
Given('the CLI is available', async ({}) => {
  // Implementation
});

// Web steps (need page fixture)
Given('I am on the web CLI page', async ({ page }) => {
  await page.goto('/src/cli/web-cli.html');
});
```

## Tags

- `@cli` - CLI-only tests
- `@web` - Web-only tests

## Troubleshooting

### Vitest Conflict
If you see `TypeError: Cannot redefine property: Symbol($$jest-matchers-object)`, this is a known conflict between vitest and playwright. The tests should still run despite this warning.

### Regenerating Tests
If you modify feature files or step definitions, regenerate the tests:
```bash
npx bddgen test
```

## Writing New Tests

1. Create a `.feature` file in `features/` with Gherkin syntax
2. Implement step definitions in `step-definitions/`
3. Use `Given`, `When`, `Then` from `playwright-bdd`
4. Regenerate tests: `npx bddgen test`
5. Run tests: `npm run test:bdd`
