import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS, PRODUCTS } from '../utils/test-data';

test('logout returns to login and cart persists across login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard.username, USERS.standard.password);
  await expect(page).toHaveURL(/.*inventory\.html/);

  const inventory = new InventoryPage(page);
  await inventory.addItemByName(PRODUCTS[0]);
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
