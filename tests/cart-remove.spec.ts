import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS, PRODUCTS } from '../utils/test-data';

test('remove item from cart updates contents @regression', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard.username, USERS.standard.password);

  const inventory = new InventoryPage(page);
  await inventory.addItemByName(PRODUCTS[0]);
  await inventory.addItemByName(PRODUCTS[1]);
  await inventory.openCart();

  const cart = new CartPage(page);
  await cart.assertHasItem(PRODUCTS[0]);
  await cart.assertHasItem(PRODUCTS[1]);

  await cart.removeItem(PRODUCTS[1]);
  await cart.assertItemAbsent(PRODUCTS[1]);
});
