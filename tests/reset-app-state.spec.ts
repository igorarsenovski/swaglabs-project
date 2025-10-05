import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS, PRODUCTS } from '../utils/test-data';

test('reset app state clears cart badge', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard.username, USERS.standard.password);
  await expect(page).toHaveURL(/.*inventory\.html/);

  const inventory = new InventoryPage(page);
  await inventory.addItemByName(PRODUCTS[0]);
  await inventory.assertCartBadgeCount(1);

  await page.click('#react-burger-menu-btn');
  const resetLink = page.locator('#reset_sidebar_link');
  await expect(resetLink).toBeVisible();
  await resetLink.click();

  await inventory.assertCartBadgeCount(0);
});
