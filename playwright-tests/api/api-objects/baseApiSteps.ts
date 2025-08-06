import { APIRequestContext, APIResponse, expect, test } from '@playwright/test';

export class BaseApiSteps {
  constructor(protected request: APIRequestContext) {}

  async sentGetResponse(endpoint: string) {
    return await test.step(`Send GET request to ${endpoint}`, async () => {
      const response = await this.request.get(endpoint);
      return response;
    });
  }

  async expectStatusCode(response: APIResponse, statusCode: number) {
    await test.step(`Expect status code: ${statusCode}`, async () => {
      expect(response.status(), `Status was ${response.status()}`).toBe(statusCode);
    });
  }


  async expectErrorResponse(
    response: APIResponse,
    expectedStatus: number,
    errorMessage?: string,
  ): Promise<void> {
    await test.step(`Check error response: ${expectedStatus}`, async () => {
      expect(response.status()).toBe(expectedStatus);

      if (errorMessage) {
        const data = await response.json();
        expect(data).toHaveProperty('error');

        // Проверяем, что ошибка содержится либо в основном сообщении, либо в деталях
        const hasErrorInMain = data.error.includes(errorMessage);
        const hasErrorInDetails =
          data.details &&
          Array.isArray(data.details) &&
          data.details.some((detail: string) => detail.includes(errorMessage));

        expect(hasErrorInMain || hasErrorInDetails).toBeTruthy();
      }
    });
  }

  async measureResponseTime(operation: () => Promise<APIResponse>): Promise<{ response: APIResponse; time: number }> {
    return await test.step('Measure response time', async () => {
      const startTime = Date.now();
      const response = await operation();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Логируем в Allure отчет
      await test.step(`Response time: ${responseTime}ms`, async () => {
        // Allure автоматически добавит это в отчет
      });
      
      return { response, time: responseTime };
    });
  }

  async expectResponseTime(responseTime: number, maxTime: number): Promise<void> {
    await test.step(`Check response time: ${responseTime}ms <= ${maxTime}ms`, async () => {
      expect(responseTime).toBeLessThanOrEqual(maxTime);
    });
  }

  async expectAverageResponseTime(responseTimes: number[], maxAvgTime: number): Promise<void> {
    await test.step(`Check average response time`, async () => {
      const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      expect(avgTime).toBeLessThanOrEqual(maxAvgTime);
      
      await test.step(`Average response time: ${avgTime.toFixed(2)}ms`, async () => {
        // Allure автоматически добавит это в отчет
      });
    });
  }

  async expectMaxResponseTime(responseTimes: number[], maxTime: number): Promise<void> {
    await test.step(`Check maximum response time`, async () => {
      const maxTimeActual = Math.max(...responseTimes);
      expect(maxTimeActual).toBeLessThanOrEqual(maxTime);
      
      await test.step(`Maximum response time: ${maxTimeActual}ms`, async () => {
        // Allure автоматически добавит это в отчет
      });
    });
  }
}
