import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/setup/global-setup.ts',
  timeout: 30_000,
  expect: { timeout: 7_500 },
  retries: 1,
  reporter: [['html', { open: 'never' }], ['allure-playwright']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui-auth-chromium',
      testMatch: ['**/auth.spec.ts'],
      use: { ...devices['Desktop Chrome'], storageState: undefined },
    },
    {
      name: 'ui-auth-firefox',
      testMatch: ['**/auth.spec.ts'],
      use: { ...devices['Desktop Firefox'], storageState: undefined },
    },
    {
      name: 'ui-auth-webkit',
      testMatch: ['**/auth.spec.ts'],
      use: { ...devices['Desktop Safari'], storageState: undefined },
    },
    {
      name: 'app-standard-chromium',
      testIgnore: ['**/auth.spec.ts'],
      use: { ...devices['Desktop Chrome'], storageState: 'storageState/standard.json' },
    },
    {
      name: 'app-standard-firefox',
      testIgnore: ['**/auth.spec.ts'],
      use: { ...devices['Desktop Firefox'], storageState: 'storageState/standard.json' },
    },
    {
      name: 'app-standard-webkit',
      testIgnore: ['**/auth.spec.ts'],
      use: { ...devices['Desktop Safari'], storageState: 'storageState/standard.json' },
    },
  ],
});
