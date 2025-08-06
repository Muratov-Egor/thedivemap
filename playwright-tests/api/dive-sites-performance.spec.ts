import { expect, test } from '@playwright/test';
import { DiveSitesApi } from './api-objects/diveSitesApi';
import { TEST_DATA } from './test-data';

// Базовый тест производительности
test('GET /dive-sites - производительность базового запроса', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  const startTime = Date.now();

  const response = await diveSitesApi.getAllSites();
  const endTime = Date.now();

  await diveSitesApi.expectStatusCode(response, 200);
  const responseTime = endTime - startTime;

  console.log(`Response time: ${responseTime}ms`);
});

// Тест производительности с фильтрацией
test('GET /dive-sites - производительность с фильтрацией', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  const startTime = Date.now();

  const response = await diveSitesApi.getSitesWithFilters({
    country_id: TEST_DATA.COUNTRIES.THAILAND,
    site_type_id: TEST_DATA.SITE_TYPES.REEF,
    rating_min: TEST_DATA.FILTER_VALUES.RATING_MIN,
  });
  const endTime = Date.now();

  await diveSitesApi.expectStatusCode(response, 200);
  const responseTime = endTime - startTime;

  console.log(`Filtered response time: ${responseTime}ms`);
});

// Тест параллельных запросов
test('GET /dive-sites - производительность параллельных запросов', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  const startTime = Date.now();

  const promises = [
    diveSitesApi.getAllSites(),
    diveSitesApi.getSitesByCountry(TEST_DATA.COUNTRIES.THAILAND),
    diveSitesApi.getSitesByType(TEST_DATA.SITE_TYPES.REEF),
    diveSitesApi.getSitesByDifficulty(TEST_DATA.DIFFICULTY.BEGINNER),
    diveSitesApi.getSitesByStatus('published'),
  ];

  const responses = await Promise.all(promises);
  const endTime = Date.now();

  for (const response of responses) {
    await diveSitesApi.expectStatusCode(response, 200);
  }

  const responseTime = endTime - startTime;
  console.log(`Parallel requests time: ${responseTime}ms`);
});

// Нагрузочное тестирование
test('GET /dive-sites - нагрузочное тестирование', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  const iterations = 10;
  const responseTimes: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    const response = await diveSitesApi.getAllSites();
    const endTime = Date.now();

    await diveSitesApi.expectStatusCode(response, 200);
    responseTimes.push(endTime - startTime);
  }

  const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const maxResponseTime = Math.max(...responseTimes);

  console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`Max response time: ${maxResponseTime}ms`);
});
