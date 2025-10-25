import { Page, expect, Locator } from '@playwright/test';

export class CartPage {
  private cartItem = '.cart_item';
  private checkoutBtn = '[data-test="checkout"]';

  constructor(private page: Page) {}

  items() : Locator{
    return this.page.locator(this.cartItem);
  }

  async assertHasItem(name: string) {
    await expect(this.items().filter({ hasText: name })).toBeVisible();
  }

  async assertItemAbsent(name: string) {
    await expect(this.items().filter({ hasText: name })).toHaveCount(0);
  }

  async assertCount(expected: number) {
    await expect(this.items()).toHaveCount(expected);
  }

  async removeItem(name: string) {
    const row = this.items().filter({ hasText: name });
    await row.locator('button:has-text("Remove")').click();
  }

  async checkout() {
    await this.page.click(this.checkoutBtn);
  }
}
