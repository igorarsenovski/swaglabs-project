import { Page, expect } from '@playwright/test';

export class InventoryPage {
  private itemCard = '.inventory_item';
  private cartLink = '.shopping_cart_link';
  private cartBadge = '.shopping_cart_badge';
  private name = '.inventory_item_name';
  private price = '.inventory_item_price';
  private sortSelect = '[data-test="product-sort-container"]';
  private inventoryList = '.inventory_list';
  private menuButton = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';
  private resetLink = '#reset_sidebar_link';

  constructor(private page: Page) {}

  async waitUntilLoaded() {
    await this.page.locator(this.inventoryList).waitFor({ state: 'visible' });
    await this.page.locator(this.sortSelect).waitFor({ state: 'visible' });
  }

  async addItemByName(name: string) {
    const card = this.page.locator(this.itemCard).filter({ hasText: name });
    await card.locator('button:has-text("Add to cart")').click();
  }

  async removeItemByName(name: string) {
    const card = this.page.locator(this.itemCard).filter({ hasText: name });
    await card.locator('button:has-text("Remove")').click();
  }

  async openCart() {
    await this.page.click(this.cartLink);
  }

  async assertCartBadgeCount(expected: number) {
    if (expected === 0) {
      await expect(this.page.locator(this.cartBadge)).toHaveCount(0);
    } else {
      await expect(this.page.locator(this.cartBadge)).toHaveText(String(expected));
    }
  }

  async openProduct(name: string) {
    await this.page.locator(this.itemCard).filter({ hasText: name }).locator(this.name).click();
  }

  async readAllNames(): Promise<string[]> {
    return await this.page.locator(this.name).allTextContents();
  }

  async readAllPrices(): Promise<number[]> {
    const texts = await this.page.locator(this.price).allTextContents();
    return texts.map((t) => Number(t.replace('$', '').trim()));
  }

  async setSortByValue(value: 'az' | 'za' | 'lohi' | 'hilo') {
    const dropdown = this.page.locator(this.sortSelect);
    await dropdown.waitFor({ state: 'visible' });
    await dropdown.selectOption(value);
    await expect(dropdown).toHaveValue(value);
  }

  async openMenu() {
    await this.page.click(this.menuButton);
  }

  async logout() {
    await this.openMenu();
    const logoutLink = this.page.locator(this.logoutLink);
    await expect(logoutLink).toBeVisible();
    await logoutLink.click();
  }

  async resetAppState() {
    await this.openMenu();
    const reset = this.page.locator(this.resetLink);
    await expect(reset).toBeVisible();
    await reset.click();
  }
}
