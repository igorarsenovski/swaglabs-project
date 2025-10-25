import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS, PRODUCTS } from '../utils/test-data';

test.describe.configure({ mode: 'parallel' });

test.describe('Cart', () => {
  test('add item shows in cart @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);

    const inventory = new InventoryPage(page);
    await inventory.addItemByName(PRODUCTS.BACKPACK.name);
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.assertHasItem(PRODUCTS.BACKPACK.name);
  });

  test('remove item from cart updates contents @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);

    const inventory = new InventoryPage(page);
    await inventory.addItemByName(PRODUCTS.BACKPACK.name);
    await inventory.addItemByName(PRODUCTS.BIKE_LIGHT.name);
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.assertHasItem(PRODUCTS.BACKPACK.name);
    await cart.assertHasItem(PRODUCTS.BIKE_LIGHT.name);

    await cart.assertCount(2);
    await cart.removeItem(PRODUCTS.BACKPACK.name);
    await cart.assertCount(1);

    await cart.assertItemAbsent(PRODUCTS.BACKPACK.name);
    await cart.assertHasItem(PRODUCTS.BIKE_LIGHT.name);
  });
});
