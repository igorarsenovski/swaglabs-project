import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Prompt: Generate a Playwright test that logs in with standard_user/secret_sauce and asserts redirect.
 */
test('AI: login as standard_user works', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login('standard_user', 'secret_sauce');
  await login.assertOnInventory();
});
