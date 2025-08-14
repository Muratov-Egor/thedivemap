import { Page, test } from '@playwright/test';

export class BaseSteps {
  constructor(protected page: Page) {}

  async openPage(url: string = '/') {
    await test.step(`Open page ${url}`, async () => {
      await this.page.goto(url);
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

  async mockApiResponseWithPattern(pattern: string, response: any) {
    await test.step(`Mock API response for pattern ${pattern}`, async () => {
      await this.page.route(pattern, async (route) => {
        await route.fulfill({ json: response });
      });
    });
  }

  async mockApiError(pattern: string, status: number, body: string) {
    await test.step(`Mock API error for pattern ${pattern} with status ${status}`, async () => {
      await this.page.route(pattern, async (route) => {
        await route.fulfill({ status, body });
      });
    });
  }

  async mockApiNetworkError(pattern: string) {
    await test.step(`Mock API network error for pattern ${pattern}`, async () => {
      await this.page.route(pattern, async (route) => {
        await route.abort('failed');
      });
    });
  }

  async mockApiMalformedJson(pattern: string) {
    await test.step(`Mock API malformed JSON for pattern ${pattern}`, async () => {
      await this.page.route(pattern, async (route) => {
        await route.fulfill({
          status: 200,
          body: 'invalid json',
        });
      });
    });
  }
}
