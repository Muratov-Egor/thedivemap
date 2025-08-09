import { expect, test } from '@playwright/test';
import { DiveSitesApi } from './api-objects/diveSitesApi';
import { TEST_DATA } from './test-data';

// Критические граничные значения
test('GET /dive-sites - validation of critical boundary values', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);

  const criticalBoundaries = [
    { depth_min: 0, visibility_min: 0, rating_min: 0 },
    { depth_min: 50, visibility_min: 30, rating_min: 5 },
    { depth_min: 40, visibility_min: 20, rating_min: 4 },
  ];

  for (const boundaries of criticalBoundaries) {
    const response = await diveSitesApi.getSitesWithFilters(boundaries);
    await diveSitesApi.expectStatusCode(response, 200);
  }
});

// Тесты валидации специальных символов
test('GET /dive-sites - validation of special characters in parameters', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);

  const specialCharParams = [
    { id: `${TEST_DATA.SITE_IDS.VALID}<script>` },
    { country_id: `${TEST_DATA.COUNTRIES.THAILAND}; DROP TABLE sites;` },
    { site_type_id: `${TEST_DATA.SITE_TYPES.REEF} OR 1=1` },
    { status: "published'; DROP TABLE sites; --" },
  ];

  for (const params of specialCharParams) {
    const response = await diveSitesApi.getSitesWithFilters(
      params as unknown as Record<string, string | number>,
    );
    expect(response.status()).toBeGreaterThanOrEqual(400);
  }
});

// Тесты валидации множественных параметров
test('GET /dive-sites - validation of multiple invalid parameters', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);

  const invalidMultiParams = [{ id: TEST_DATA.SITE_IDS.INVALID, status: 'invalid-status' }];

  for (const params of invalidMultiParams) {
    const response = await diveSitesApi.getSitesWithFilters(params);
    await diveSitesApi.expectErrorResponse(response, 400);
  }
});
