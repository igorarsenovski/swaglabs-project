import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS, PRODUCTS } from '../utils/test-data';

test('add item shows in cart @smoke', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard.username, USERS.standard.password);

  const inventory = new InventoryPage(page);
  await inventory.addItemByName(PRODUCTS[0]);
  await inventory.openCart();

  const cart = new CartPage(page);
  await cart.assertHasItem(PRODUCTS[0]);
});
