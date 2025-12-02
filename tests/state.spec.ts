import { test } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { PRODUCTS } from '../utils/test-data';

test.describe('App State & Persistence', () => {
  test('Reset app state clears cart badge', async ({ page }) => {
    await page.goto('/inventory.html');

    const inventory = new InventoryPage(page);
    await inventory.addItemByName(PRODUCTS.BACKPACK.name);
    await inventory.assertCartBadgeCount(1);

    await inventory.resetAppState();

    await inventory.assertCartBadgeCount(0);
  });
});
