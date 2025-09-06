import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, PRODUCTS } from '../utils/test-data';

test('missing first name blocks checkout @regression', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard.username, USERS.standard.password);

  const inventory = new InventoryPage(page);
  await inventory.addItemByName(PRODUCTS[0]);
  await inventory.openCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const checkout = new CheckoutPage(page);
  await checkout.fillCustomer('', 'Tester', '1000');
  await checkout.continue();
  await checkout.assertErrorContains('First Name is required');
});
