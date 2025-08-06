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
}