import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { USERS, PRODUCTS } from '../../utils/test-data';

/**
 * Prompt: Checkout with missing fields shows errors.
 */
const cases = [
  {
    label: 'missing last name',
    first: 'Igor',
    last: '',
    postal: '1000',
    error: 'Last Name is required',
  },
  {
    label: 'missing postal',
    first: 'Igor',
    last: 'Tester',
    postal: '',
    error: 'Postal Code is required',
  },
];

for (const c of cases) {
  test(`AI: checkout blocked when ${c.label}`, async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);

    const inventory = new InventoryPage(page);
    await inventory.addItemByName(PRODUCTS.BACKPACK.name);
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.fillCustomer(c.first, c.last, c.postal);
    await checkout.continue();
    await checkout.assertErrorContains(c.error);
  });
}
