import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../utils/test-data';

test.describe('Login', () => {
  test('valid login redirects to inventory @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);
    await login.assertOnInventory();
  });

  test('invalid login shows error @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('invalid_user', 'wrong_pass');
    await login.assertErrorContains('Epic sadface');
  });

  test('locked_out_user shows error @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.locked.username, USERS.locked.password);
    await login.assertErrorContains('locked out');
  });
});
