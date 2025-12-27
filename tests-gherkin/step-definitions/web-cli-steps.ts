import { createBdd, test } from 'playwright-bdd';
import { expect, type Page } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

let lastProfileId: string = '';
let lastUserHandle: string = '';

// Get page from Playwright context
Given('I am on the web CLI page', async ({ page }) => {
  await page.goto('/src/cli/web-cli.html');
});

Given('the command input is focused', async ({ page }) => {
  const commandInput = page.locator('input[type="text"]');
  await expect(commandInput).toBeFocused();
});

Given('I have added a user with handle {string}', async ({ page }, handle: string) => {
  lastUserHandle = handle;
  const commandInput = page.locator('input[type="text"]');
  const executeButton = page.locator('button:has-text("Execute")');
  const output = page.locator('.output');

  await commandInput.fill(`add-user ${handle}`);
  await executeButton.click();
  
  await expect(output).toContainText('User created successfully');
  
  // Extract profile ID
  const outputText = await output.textContent();
  const match = outputText?.match(/Profile ID: ([^\s]+)/);
  if (match) {
    lastProfileId = match[1];
  }
});

Given('I have a JSON file with user data', async ({}) => {
  // This will be handled in the When step
});

When('I enter the command {string}', async ({ page }, command: string) => {
  const commandInput = page.locator('input[type="text"]');
  await commandInput.fill(command);
});

When('I click the Execute button', async ({ page }) => {
  const executeButton = page.locator('button:has-text("Execute")');
  await executeButton.click();
});

When('I enter the command {string} with that user\'s profile ID', async ({ page }, command: string) => {
  expect(lastProfileId).toBeTruthy();
  const commandInput = page.locator('input[type="text"]');
  await commandInput.fill(`${command} ${lastProfileId}`);
});

When('I refresh the page', async ({ page }) => {
  await page.reload();
  await expect(page.locator('input[type="text"]')).toBeVisible();
});

// Removed duplicate "I list all users" - use "I enter the command 'list-users'" + "I click the Execute button" instead

When('I click the {string} button', async ({ page }, buttonText: string) => {
  // Try button first, then label (for "Upload JSON" which is a label)
  const button = page.locator(`button:has-text("${buttonText}"), label:has-text("${buttonText}")`);
  await button.first().click();
});

When('I select the JSON file', async ({ page }) => {
  const fileInput = page.locator('input[type="file"]');
  const output = page.locator('.output');
  
  // Create a test JSON file
  const testData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    tables: {
      playerProfiles: {
        'test-profile-import': {
          id: 'test-profile-import',
          handle: 'ImportedUser',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          webCryptoWallet: '{}',
        },
      },
    },
  };
  
  const fs = await import('fs/promises');
  const path = await import('path');
  const os = await import('os');
  const tempFile = path.join(os.tmpdir(), `test-import-${Date.now()}.json`);
  await fs.writeFile(tempFile, JSON.stringify(testData, null, 2));
  
  await fileInput.setInputFiles(tempFile);
  
  // Wait for import to complete
  await expect(output).toContainText('JSON imported successfully');
  
  // Clean up
  await fs.unlink(tempFile);
});

Then('I should see {string} in the output', async ({ page }, text: string) => {
  const output = page.locator('.output');
  await expect(output).toContainText(text);
});

Then('I should see a profile ID in the output', async ({ page }) => {
  const output = page.locator('.output');
  const outputText = await output.textContent();
  expect(outputText).toMatch(/Profile ID: [^\s]+/);
});

Then('I should not see {string} in the output', async ({ page }, text: string) => {
  const output = page.locator('.output');
  await expect(output).not.toContainText(text);
});

Then('a JSON file should be downloaded', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  const downloadButton = page.locator('button:has-text("Download JSON")');
  await downloadButton.click();
  
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^player_profiles_.*\.json$/);
});

Then('the JSON file should contain the user data', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  const downloadButton = page.locator('button:has-text("Download JSON")');
  await downloadButton.click();
  
  const download = await downloadPromise;
  const path = await download.path();
  const fs = await import('fs/promises');
  const content = await fs.readFile(path!, 'utf-8');
  const json = JSON.parse(content);
  
  expect(json.tables.playerProfiles).toBeDefined();
  const profiles = Object.values(json.tables.playerProfiles);
  expect(profiles.length).toBeGreaterThan(0);
});

Then('the downloaded JSON file should have the correct format', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  const downloadButton = page.locator('button:has-text("Download JSON")');
  await downloadButton.click();
  
  const download = await downloadPromise;
  const path = await download.path();
  const fs = await import('fs/promises');
  const content = await fs.readFile(path!, 'utf-8');
  const json = JSON.parse(content);
  
  expect(json).toHaveProperty('version');
  expect(json).toHaveProperty('exportedAt');
  expect(json).toHaveProperty('tables');
});

Then('the imported user should appear in the user list', async ({ page }) => {
  const commandInput = page.locator('input[type="text"]');
  const executeButton = page.locator('button:has-text("Execute")');
  const output = page.locator('.output');
  
  await commandInput.fill('list-users');
  await executeButton.click();
  
  await expect(output).toContainText('ImportedUser');
});

