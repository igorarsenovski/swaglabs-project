import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Prompt: Login, open burger menu, logout, verify login page visible.
 */
test('AI: logout via burger menu returns to login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/.*inventory\.html/);

  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');

  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator('#login-button')).toBeVisible();
});
