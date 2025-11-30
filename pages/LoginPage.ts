import { Page, expect } from '@playwright/test';

export class LoginPage {
  private username = '#user-name';
  private password = '#password';
  private loginBtn = '#login-button';
  private error = '[data-test="error"]';

  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page.fill(this.username, username);
    await this.page.fill(this.password, password);
    await this.page.click(this.loginBtn);
  }

  async assertOnLoginPage() {
    await expect(this.page).toHaveURL(/.*saucedemo\.com\/?/);
    await expect(this.page.locator(this.loginBtn)).toBeVisible();
  }
  
  async assertOnInventory() {
    await expect(this.page).toHaveURL(/.*inventory/);
  }

  async assertErrorContains(text: string) {
    await expect(this.page.locator(this.error)).toContainText(text);
  }
}
