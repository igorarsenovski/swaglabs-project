import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS, PRODUCTS } from '../utils/test-data';

test('open product details and return to inventory @regression', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard.username, USERS.standard.password);

  const inventory = new InventoryPage(page);
  await inventory.openProduct(PRODUCTS[0]);

  await expect(page).toHaveURL(/.*inventory-item/);
  await page.click('[data-test="back-to-products"]');
  await expect(page).toHaveURL(/.*inventory\.html/);
});
