import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';

test.describe.configure({ mode: 'parallel' });

test.describe('Sorting', () => {
  test('sort by price low→high yields ascending prices @regression', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const inventory = new InventoryPage(page);
    await inventory.setSortByValue('lohi');

    const prices = await inventory.readAllPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sort by price high→low yields descending prices @regression', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const inventory = new InventoryPage(page);
    await inventory.setSortByValue('hilo');

    const prices = await inventory.readAllPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('sort by name A→Z yields ascending alphabetical order @regression', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const inventory = new InventoryPage(page);
    await inventory.setSortByValue('az');

    const names = await inventory.readAllNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('sort by name Z→A yields descending alphabetical order @regression', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const inventory = new InventoryPage(page);
    await inventory.setSortByValue('za');

    const names = await inventory.readAllNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });
});
