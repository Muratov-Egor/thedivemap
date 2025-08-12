import { Page, test } from '@playwright/test';

export class BaseSteps {
  constructor(protected page: Page) {}

  async openPage(url: string = '/') {
    await test.step(`Open page ${url}`, async () => {
      await this.page.goto(url);
    });
  }

  async setMobileViewport() {
    await test.step('Set mobile viewport size to 375x812', async () => {
      await this.page.setViewportSize({ width: 375, height: 812 });
    });
  }

  async waitForDataLoaded() {
    await test.step('Wait for dive sites data to be loaded', async () => {
      // Ждем исчезновения индикатора загрузки
      await this.page.waitForSelector('[data-testid="loading-indicator"]', {
        state: 'hidden',
        timeout: 10000,
      });
      // Или ждем появления кластеров/маркеров
      await this.page.waitForSelector(
        '[data-testid="marker-cluster"], [data-testid^="dive-site-marker-"]',
        { timeout: 10000 },
      );
    });
  }

  async mockApiResponse(path: string, response: any) {
    await test.step(`Mock API response for ${path}`, async () => {
      await this.page.route(path, async (route) => {
        await route.fulfill({ json: response });
      });
    });
  }
}
