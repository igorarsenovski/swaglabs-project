import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, PRODUCTS } from '../utils/test-data';

const toNum = (s: string | null) => Number((s ?? '').replace(/[^0-9.]/g, ''));

test('@regression order summary totals are correct', async ({ page }) => {

  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard.username, USERS.standard.password);

  const inv = new InventoryPage(page);
  await inv.addItemByName(PRODUCTS[0]);
  await inv.addItemByName(PRODUCTS[1]);
  await inv.openCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const co = new CheckoutPage(page);
  await co.fillCustomer('Igor', 'Tester', '1000');
  await co.continue();

  const itemTotalText = await page.locator('.summary_subtotal_label').textContent();
  const taxText = await page.locator('.summary_tax_label').textContent();      
  const totalText = await page.locator('.summary_total_label').textContent();

  const items = await co.readItemTotal();
  const tax   = await co.readTax();
  const total = await co.readTotal();
  expect(Number((items + tax).toFixed(2))).toBe(total);

});
