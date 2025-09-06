import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../utils/test-data';

test('sort by price low→high yields ascending prices @regression', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard.username, USERS.standard.password);
  await expect(page).toHaveURL(/.*inventory\.html/);

  const inventory = new InventoryPage(page);
  await inventory.setSortByValue('lohi');

  const prices = await inventory.readAllPrices();
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);
});
