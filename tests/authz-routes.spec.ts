import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../utils/test-data';

test('unauthenticated users are redirected from inventory @regression', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);
  await expect(page.locator('#login-button')).toBeVisible();
});

test('authenticated user can open cart directly @regression', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard.username, USERS.standard.password);

  await page.goto('https://www.saucedemo.com/cart.html');
  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
});
