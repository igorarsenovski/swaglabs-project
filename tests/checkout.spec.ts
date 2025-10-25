import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, PRODUCTS, CUSTOMER } from '../utils/test-data';

test.describe.configure({ mode: 'parallel' });

test.describe('Checkout', () => {
  test('complete order with two items @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);

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

  test('missing first name blocks checkout @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);

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

  test('order summary totals are correct @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);

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
