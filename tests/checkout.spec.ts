import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PRODUCTS, CUSTOMER } from '../utils/test-data';

test.describe.configure({ mode: 'parallel' });

test.describe('Checkout', () => {
  test('complete order with two items @smoke', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const inventory = new InventoryPage(page);
    await inventory.addItemByName(PRODUCTS.BACKPACK.name);
    await inventory.addItemByName(PRODUCTS.BIKE_LIGHT.name);
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.fillCustomer(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();
    await checkout.finish();
    await checkout.assertOrderCompleted();
  });

  test('Missing first name blocks checkout @regression', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const inventory = new InventoryPage(page);
    await inventory.addItemByName(PRODUCTS.BACKPACK.name);
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.fillCustomer('', 'Tester', '1000');
    await checkout.continue();
    await checkout.assertErrorContains('First Name is required');
  });

  test('Order summary totals are correct @regression', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const inventory = new InventoryPage(page);
    await inventory.addItemByName(PRODUCTS.BACKPACK.name);
    await inventory.addItemByName(PRODUCTS.BIKE_LIGHT.name);
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.fillCustomer(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();

    const itemsTotal = await checkout.readItemTotal();
    const tax = await checkout.readTax();
    const displayedTotal = await checkout.readTotal();

    const expectedTotal = parseFloat((itemsTotal + tax).toFixed(2));
    expect(displayedTotal).toBeCloseTo(expectedTotal, 2);

    test.info().attach('Totals', {
      body: JSON.stringify({ itemsTotal, tax, displayedTotal, expectedTotal }, null, 2),
      contentType: 'application/json',
    });
  });
});
