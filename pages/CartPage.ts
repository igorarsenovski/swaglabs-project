import { Page, expect } from '@playwright/test';

export class CartPage {
  private cartItem = '.cart_item';
  private checkoutBtn = '[data-test="checkout"]';

  constructor(private page: Page) {}

  async assertHasItem(name: string) {
    await expect(this.page.locator(this.cartItem).filter({ hasText: name })).toBeVisible();
  }

  async assertItemAbsent(name: string) {
    await expect(this.page.locator(this.cartItem).filter({ hasText: name })).toHaveCount(0);
  }

  async removeItem(name: string) {
    const row = this.page.locator(this.cartItem).filter({ hasText: name });
    await row.locator('button:has-text("Remove")').click();
  }

  async checkout() {
    await this.page.click(this.checkoutBtn);
  }
}
