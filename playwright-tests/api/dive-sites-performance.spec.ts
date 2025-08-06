import { expect, test } from '@playwright/test';
import { DiveSitesApi } from './api-objects/diveSitesApi';
import { TEST_DATA } from './test-data';

// Базовый тест производительности
test('Response time for GET /dive-sites is less than 3 seconds', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  
  const { response, time } = await diveSitesApi.measureResponseTime(() => 
    diveSitesApi.getAllSites()
  );
  
  await diveSitesApi.expectStatusCode(response, 200);
  await diveSitesApi.expectResponseTime(time, 3000); // Максимум 3 секунды
});

// Тест производительности с фильтрацией
test('Response time for GET /dive-sites with filters is less than 2 seconds', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  
  const { response, time } = await diveSitesApi.measureResponseTime(() => 
    diveSitesApi.getSitesWithFilters({
      country_id: TEST_DATA.COUNTRIES.THAILAND,
      site_type_id: TEST_DATA.SITE_TYPES.REEF,
      rating_min: TEST_DATA.FILTER_VALUES.RATING_MIN
    })
  );
  
  await diveSitesApi.expectStatusCode(response, 200);
  await diveSitesApi.expectResponseTime(time, 2000); // Максимум 2 секунды
});

// Тест параллельных запросов
test('Parallel requests for GET /dive-sites are less than 4 seconds', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  
  const { time } = await diveSitesApi.measureResponseTime(async () => {
    const promises = [
      diveSitesApi.getAllSites(),
      diveSitesApi.getSitesByCountry(TEST_DATA.COUNTRIES.THAILAND),
      diveSitesApi.getSitesByType(TEST_DATA.SITE_TYPES.REEF),
      diveSitesApi.getSitesByDifficulty(TEST_DATA.DIFFICULTY.BEGINNER),
      diveSitesApi.getSitesByStatus('published')
    ];
    
    const responses = await Promise.all(promises);
    
    for (const response of responses) {
      await diveSitesApi.expectStatusCode(response, 200);
    }
    
    return responses[0]; // Возвращаем первый ответ для совместимости
  });
  
  await diveSitesApi.expectResponseTime(time, 4000); // Максимум 4 секунды для всех запросов
});

// Нагрузочное тестирование
test('Response time for GET /dive-sites is less than 2 seconds on average and less than 5 seconds maximum', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);
  const iterations = 10;
  const responseTimes: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const { response, time } = await diveSitesApi.measureResponseTime(() => 
      diveSitesApi.getAllSites()
    );
    
    await diveSitesApi.expectStatusCode(response, 200);
    responseTimes.push(time);
  }
  
  await diveSitesApi.expectAverageResponseTime(responseTimes, 2000); // Среднее время менее 2 секунд
  await diveSitesApi.expectMaxResponseTime(responseTimes, 5000); // Максимальное время менее 5 секунд
});
