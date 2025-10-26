import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { PRODUCTS } from '../utils/test-data';

test.describe('App State & Persistence', () => {
  test('reset app state clears cart badge', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const inventory = new InventoryPage(page);
    await inventory.addItemByName(PRODUCTS.BACKPACK.name);
    await inventory.assertCartBadgeCount(1);

    await page.click('#react-burger-menu-btn');
    const resetLink = page.locator('#reset_sidebar_link');
    await expect(resetLink).toBeVisible();
    await resetLink.click();

    await inventory.assertCartBadgeCount(0);
  });
});
