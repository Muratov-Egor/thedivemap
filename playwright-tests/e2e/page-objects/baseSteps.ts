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
      try {
        await this.page.waitForSelector('[data-testid="loading-indicator"]', {
          state: 'hidden',
          timeout: 10000,
        });
      } catch (error) {
        // Если индикатор загрузки не найден, это нормально
        console.log('Loading indicator not found, continuing...');
      }
      
      // Ждем появления кластеров/маркеров или уведомления
      await this.page.waitForSelector(
        '[data-testid="marker-cluster"], [data-testid^="dive-site-marker-"], [data-testid="notification"]',
        { timeout: 15000 },
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

  async mockApiBoundsError(pattern: string, status: number = 404) {
    await test.step(`Mock API bounds error for pattern ${pattern} with status ${status}`, async () => {
      await this.page.route(pattern, async (route) => {
        if (status === 404) {
          await route.fulfill({
            status: 404,
            body: JSON.stringify({ error: 'No sites found for the specified criteria' }),
          });
        } else {
          await route.fulfill({
            status,
            body: JSON.stringify({ error: 'Failed to fetch bounds' }),
          });
        }
      });
    });
  }
}
