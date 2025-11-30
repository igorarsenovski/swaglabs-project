import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS, PRODUCTS } from '../utils/test-data';

test.describe('Authentication & Access Control', () => {
  test('Valid login redirects to inventory @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);
    await login.assertOnInventory();
  });

  test('Invalid login shows error @regression', async ({ page }) => {
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

  test('Unauthenticated users are redirected from inventory @regression', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('Authenticated user can open cart directly @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);

    await page.goto('https://www.saucedemo.com/cart.html');
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
  });

  test('Logout returns to login and cart persists across login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/.*inventory\.html/);

    const inventory = new InventoryPage(page);
    await inventory.addItemByName(PRODUCTS.BACKPACK.name);
    await inventory.assertCartBadgeCount(1);

    const menuBtn = page.locator('#react-burger-menu-btn');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    const logoutLink = page.locator('#logout_sidebar_link');
    await expect(logoutLink).toBeVisible();
    await logoutLink.click();

    await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);
    await expect(page.locator('#login-button')).toBeVisible();

    await login.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
    await inventory.assertCartBadgeCount(1);
  });
});
