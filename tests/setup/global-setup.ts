import { chromium } from '@playwright/test';
import fs from 'node:fs';

export default async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await page.waitForURL(/inventory\.html/);

  fs.mkdirSync('storageState', { recursive: true });
  await context.storageState({ path: 'storageState/standard.json' });
  await browser.close();
};
