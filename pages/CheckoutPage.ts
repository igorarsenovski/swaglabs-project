import { Page, expect } from '@playwright/test';
export class CheckoutPage {
  private firstName = '#first-name';
  private lastName = '#last-name';
  private postalCode = '#postal-code';
  private continueBtn = '#continue';
  private finishBtn = '#finish';
  private completeHeader = '.complete-header';
  private error = '[data-test="error"]';
  constructor(private page: Page) {}
  async fillCustomer(first: string, last: string, postal: string) {
    await this.page.fill(this.firstName, first);
    await this.page.fill(this.lastName, last);
    await this.page.fill(this.postalCode, postal);
  }
  async continue() { await this.page.click(this.continueBtn); }
  async finish() { await this.page.click(this.finishBtn); }
  async assertOrderCompleted() {
    await expect(this.page.locator(this.completeHeader)).toHaveText(/Thank you for your order!/i);
  }
  async assertErrorContains(text: string) {
    await expect(this.page.locator(this.error)).toContainText(text);
  }
}
