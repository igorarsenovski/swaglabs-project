import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS, PRODUCTS } from '../utils/test-data';

test.describe('Authentication & access control', () => {
  test('standard user can log in and see inventory @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await loginPage.assertOnInventory();
  });

  test('invalid credentials show error message @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.assertErrorContains('Epic sadface');
  });

  test('locked out user cannot log in @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await loginPage.assertErrorContains('locked out');
  });

  test('unauthenticated user is redirected from inventory to login @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/inventory.html');

    await loginPage.assertOnLoginPage();
  });

  test('authenticated user can open cart directly @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.open();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await loginPage.assertOnInventory();

    await page.goto('/cart.html');

    await cartPage.assertVisible();
  });

  test('logout returns to login and cart badge persists across relogin @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await loginPage.assertOnInventory();

    await inventoryPage.addItemByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.assertCartBadgeCount(1);

    await inventoryPage.logout();

    await loginPage.assertOnLoginPage();

    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await loginPage.assertOnInventory();

    await inventoryPage.assertCartBadgeCount(1);
  });
});
