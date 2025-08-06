import { expect, test } from '@playwright/test';
import { BaseApiSteps } from './baseApiSteps';

test('GET /dive-sites', async ({ request }) => {
  const baseApiSteps = new BaseApiSteps(request);
  const response = await baseApiSteps.sentGetResponse('/api/dive-sites');
  
  await baseApiSteps.expectStatusCode(response, 200);
});