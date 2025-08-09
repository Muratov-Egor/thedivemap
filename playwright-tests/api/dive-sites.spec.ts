import { expect, test } from '@playwright/test';
import { DiveSitesApi } from './api-objects/diveSitesApi';
import { TEST_DATA } from './test-data';

// Базовый тест получения всех дайв-сайтов
test('GET /dive-sites - получить все дайв-сайты', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  const response = await diveSitesApi.getAllSites();

  await diveSitesApi.expectStatusCode(response, 200);
  await diveSitesApi.expectValidSitesResponse(response);
});

// Тесты фильтрации по ID
test('GET /dive-sites - фильтрация по ID дайв-сайта', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  const validSiteId = TEST_DATA.SITE_IDS.VALID;

  const response = await diveSitesApi.getSiteById(validSiteId);
  await diveSitesApi.expectStatusCode(response, 200);
  await diveSitesApi.expectValidSitesResponse(response);
});

test('GET /dive-sites - невалидный ID дайв-сайта', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  const invalidSiteId = TEST_DATA.SITE_IDS.INVALID;

  const response = await diveSitesApi.getSiteById(invalidSiteId);
  await diveSitesApi.expectErrorResponse(response, 400, 'Invalid site ID format');
});

// Параметризованный тест фильтрации по основным параметрам
const filterTests = [
  {
    name: 'страна',
    method: 'getSitesByCountry' as keyof DiveSitesApi,
    param: TEST_DATA.COUNTRIES.THAILAND,
  },
  {
    name: 'регион',
    method: 'getSitesByRegion' as keyof DiveSitesApi,
    param: TEST_DATA.REGIONS.ASIA,
  },
  {
    name: 'тип сайта',
    method: 'getSitesByType' as keyof DiveSitesApi,
    param: TEST_DATA.SITE_TYPES.REEF,
  },
  {
    name: 'сложность',
    method: 'getSitesByDifficulty' as keyof DiveSitesApi,
    param: TEST_DATA.DIFFICULTY.BEGINNER,
  },
];

for (const filterTest of filterTests) {
  test(`GET /dive-sites - фильтрация по ${filterTest.name}`, async ({ request }) => {
    const diveSitesApi = new DiveSitesApi(request);
    const method = diveSitesApi[filterTest.method] as Function;
    const response = await method.call(diveSitesApi, filterTest.param);

    await diveSitesApi.expectStatusCode(response, 200);
    await diveSitesApi.expectValidSitesResponse(response);
  });
}

// Параметризованный тест фильтрации по статусам
const validStatuses = ['draft', 'published', 'rejected'];
for (const status of validStatuses) {
  test(`GET /dive-sites - фильтрация по статусу ${status}`, async ({ request }) => {
    const diveSitesApi = new DiveSitesApi(request);
    const response = await diveSitesApi.getSitesByStatus(status as any);

    await diveSitesApi.expectStatusCode(response, 200);
    await diveSitesApi.expectValidSitesResponse(response);
    await diveSitesApi.expectFilteredResults(response, 'status', status);
  });
}

test('GET /dive-sites - невалидный статус', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  const response = await diveSitesApi.getSitesWithFilters({ status: 'invalid' });
  await diveSitesApi.expectErrorResponse(response, 400, 'Invalid status');
});

// Параметризованный тест фильтрации по числовым параметрам
const numericFilters = [
  {
    name: 'минимальная глубина',
    method: 'getSitesWithMinDepth' as keyof DiveSitesApi,
    param: TEST_DATA.FILTER_VALUES.DEPTH_MIN,
  },
  {
    name: 'минимальная видимость',
    method: 'getSitesWithMinVisibility' as keyof DiveSitesApi,
    param: TEST_DATA.FILTER_VALUES.VISIBILITY_MIN,
  },
  {
    name: 'минимальный рейтинг',
    method: 'getSitesWithMinRating' as keyof DiveSitesApi,
    param: TEST_DATA.FILTER_VALUES.RATING_MIN,
  },
];

for (const numericFilter of numericFilters) {
  test(`GET /dive-sites - фильтрация по ${numericFilter.name}`, async ({ request }) => {
    const diveSitesApi = new DiveSitesApi(request);
    const method = diveSitesApi[numericFilter.method] as Function;
    const response = await method.call(diveSitesApi, numericFilter.param);

    await diveSitesApi.expectStatusCode(response, 200);
    await diveSitesApi.expectValidSitesResponse(response);
  });
}

// Ключевой комбинированный тест
test('GET /dive-sites - комбинированная фильтрация: страна + тип + рейтинг', async ({
  request,
}) => {
  const diveSitesApi = new DiveSitesApi(request);
  const filters = {
    country_id: TEST_DATA.COUNTRIES.THAILAND,
    site_type_id: TEST_DATA.SITE_TYPES.REEF,
    rating_min: TEST_DATA.FILTER_VALUES.RATING_MIN,
  };

  const response = await diveSitesApi.getSitesWithFilters(filters);
  await diveSitesApi.expectStatusCode(response, 200);
  await diveSitesApi.expectValidSitesResponse(response);
});

// Тесты валидации типов данных
test('GET /dive-sites - валидация нечисловых параметров', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);

  const invalidParams = [{ country_id: 'abc' }, { site_type_id: 'xyz' }, { depth_min: 'deep' }];

  for (const params of invalidParams) {
    const response = await diveSitesApi.getSitesWithFilters(
      params as unknown as Record<string, string | number>,
    );
    const paramName = Object.keys(params)[0];
    await diveSitesApi.expectErrorResponse(response, 400, `Invalid ${paramName}`);
  }
});
