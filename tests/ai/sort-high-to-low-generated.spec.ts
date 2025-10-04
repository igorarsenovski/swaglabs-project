import { test, expect } from '@playwright/test';

/**
 * Prompt: Sort to high→low and verify descending prices.
 */
test('AI: sort by price high→low shows descending prices', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');
  await expect(page).toHaveURL(/.*inventory\.html/);

  const sort = page.locator('[data-test="product-sort-container"]');
  await expect(sort).toBeVisible();
  await sort.selectOption('hilo');
  await expect(sort).toHaveValue('hilo');

  const priceTexts = await page.locator('.inventory_item_price').allTextContents();
  const prices = priceTexts.map((t) => parseFloat(t.replace('$', '')));
  const sorted = [...prices].sort((a, b) => b - a);
  expect(prices).toEqual(sorted);
});
