import { createBdd, test } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const { Given, When, Then } = createBdd(test);

const execAsync = promisify(exec);
const jsonFilePath = path.resolve('player_profiles.json');

let lastCommandOutput: string = '';
let lastProfileId: string = '';
let lastUserHandle: string = '';

Given('the CLI is available', async ({}) => {
  // Verify CLI is accessible
  const { stdout } = await execAsync('npm run cli -- --version');
  expect(stdout).toBeTruthy();
});

Given('the user database is clean', async ({}) => {
  // Clean up any existing test data
  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const json = JSON.parse(data);
    if (json.tables?.playerProfiles) {
      Object.keys(json.tables.playerProfiles).forEach((id) => {
        if (json.tables.playerProfiles[id].handle?.startsWith('test-user-')) {
          delete json.tables.playerProfiles[id];
        }
      });
      await fs.writeFile(jsonFilePath, JSON.stringify(json, null, 2));
    }
  } catch (e) {
    // File might not exist, that's okay
  }
});

Given('a user exists with handle {string}', async ({}, handle: string) => {
  lastUserHandle = handle;
  const { stdout } = await execAsync(`npm run cli add-user ${handle}`);
  lastCommandOutput = stdout;
  
  // Extract profile ID
  const match = stdout.match(/Profile ID: ([^\s]+)/);
  if (match) {
    lastProfileId = match[1];
  }
});

When('I add a user with handle {string}', async ({}, handle: string) => {
  lastUserHandle = handle;
  const { stdout, stderr } = await execAsync(`npm run cli add-user ${handle}`);
  lastCommandOutput = stdout;
  expect(stderr).toBe('');
  
  // Extract profile ID
  const match = stdout.match(/Profile ID: ([^\s]+)/);
  if (match) {
    lastProfileId = match[1];
  }
});

When('I list all users', async ({}) => {
  const { stdout } = await execAsync('npm run cli list-users');
  lastCommandOutput = stdout;
});

When('I view the details for that user', async ({}) => {
  expect(lastProfileId).toBeTruthy();
  const { stdout } = await execAsync(`npm run cli user-details ${lastProfileId}`);
  lastCommandOutput = stdout;
});

When('I remove that user', async ({}) => {
  expect(lastProfileId).toBeTruthy();
  const { stdout } = await execAsync(`npm run cli remove-user ${lastProfileId}`);
  lastCommandOutput = stdout;
});

When('I check the JSON file', async ({}) => {
  // This step is informational - the Then step will check the file
});

Then('the user should be created successfully', async ({}) => {
  expect(lastCommandOutput).toContain('User created successfully');
});

Then('the user should have a profile ID', async ({}) => {
  expect(lastProfileId).toBeTruthy();
  expect(lastProfileId).toMatch(/^bfg_player_profile_/);
});

Then('the user should appear in the user list', async ({}) => {
  const { stdout } = await execAsync('npm run cli list-users');
  expect(stdout).toContain(lastUserHandle);
  expect(stdout).toContain(lastProfileId);
});

Then('I should see the user {string} in the list', async ({}, handle: string) => {
  expect(lastCommandOutput).toContain(handle);
});

Then('the list should show profile IDs', async ({}) => {
  expect(lastCommandOutput).toContain('Profile ID:');
});

Then('I should see the user\'s profile ID', async ({}) => {
  expect(lastCommandOutput).toContain(`Profile ID: ${lastProfileId}`);
});

Then('I should see the user\'s handle', async ({}) => {
  expect(lastCommandOutput).toContain(`Handle: ${lastUserHandle}`);
});

Then('I should see the user\'s creation timestamp', async ({}) => {
  expect(lastCommandOutput).toContain('Created At:');
});

Then('the user should be removed successfully', async ({}) => {
  expect(lastCommandOutput).toContain('User removed successfully');
});

Then('the user should not appear in the user list', async ({}) => {
  const { stdout } = await execAsync('npm run cli list-users');
  expect(stdout).not.toContain(lastUserHandle);
  expect(stdout).not.toContain(lastProfileId);
});

Then('the user should be stored in the JSON file', async ({}) => {
  const data = await fs.readFile(jsonFilePath, 'utf-8');
  const json = JSON.parse(data);
  
  expect(json.tables).toBeDefined();
  expect(json.tables.playerProfiles).toBeDefined();
  
  const profiles = json.tables.playerProfiles;
  const userEntry = Object.values(profiles).find(
    (profile: any) => profile.handle === lastUserHandle
  );
  
  expect(userEntry).toBeDefined();
});

Then('the JSON file should have the correct format', async ({}) => {
  const data = await fs.readFile(jsonFilePath, 'utf-8');
  const json = JSON.parse(data);
  
  expect(json).toHaveProperty('version');
  expect(json).toHaveProperty('exportedAt');
  expect(json).toHaveProperty('tables');
  expect(json.tables).toHaveProperty('playerProfiles');
});

