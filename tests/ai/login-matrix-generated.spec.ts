import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Prompt: Login with standard_user and problem_user using a loop.
 */
const matrix = [
  { name: 'standard_user', username: 'standard_user', password: 'secret_sauce' },
  { name: 'problem_user',  username: 'problem_user',  password: 'secret_sauce' },
];

for (const u of matrix) {
  test(`AI: login works for ${u.name}`, async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(u.username, u.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
}
