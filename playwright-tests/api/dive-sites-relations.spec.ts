import { expect, test } from '@playwright/test';
import { DiveSitesApi } from './api-objects/diveSitesApi';
import { TEST_DATA } from './test-data';

// Общий тест проверки связанных данных
test('GET /dive-sites - response includes all related data (country, site_type, difficulty)', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);

  const response = await diveSitesApi.getAllSites();
  await diveSitesApi.expectStatusCode(response, 200);

  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();

  if (data.length > 0) {
    const site = data[0];

    // Проверяем наличие всех связанных данных
    expect(site).toHaveProperty('country');
    expect(site).toHaveProperty('site_type');
    expect(site).toHaveProperty('difficulty');

    // Проверяем структуру country
    if (site.country) {
      expect(site.country).toHaveProperty('id');
      expect(site.country).toHaveProperty('name_en');
      expect(site.country).toHaveProperty('name_ru');
      expect(site.country).toHaveProperty('region_id');
      expect(site.country).toHaveProperty('iso_code');

      expect(typeof site.country.id).toBe('number');
      expect(typeof site.country.name_en).toBe('string');
      expect(typeof site.country.name_ru).toBe('string');
      expect(typeof site.country.region_id).toBe('number');
      expect(typeof site.country.iso_code).toBe('string');
    }

    // Проверяем структуру site_type
    if (site.site_type) {
      expect(site.site_type).toHaveProperty('id');
      expect(site.site_type).toHaveProperty('label_en');
      expect(site.site_type).toHaveProperty('label_ru');

      expect(typeof site.site_type.id).toBe('number');
      expect(typeof site.site_type.label_en).toBe('string');
      expect(typeof site.site_type.label_ru).toBe('string');
    }

    // Проверяем структуру difficulty
    if (site.difficulty) {
      expect(site.difficulty).toHaveProperty('id');
      expect(site.difficulty).toHaveProperty('label_en');
      expect(site.difficulty).toHaveProperty('label_ru');

      expect(typeof site.difficulty.id).toBe('number');
      expect(typeof site.difficulty.label_en).toBe('string');
      expect(typeof site.difficulty.label_ru).toBe('string');
    }
  }
});

// Тест консистентности связанных данных
test('GET /dive-sites - consistency of related data', async ({ request }) => {
  const diveSitesApi = new DiveSitesApi(request);

  const response = await diveSitesApi.getAllSites();
  await diveSitesApi.expectStatusCode(response, 200);

  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();

  if (data.length > 0) {
    const site = data[0];

    // Проверяем, что ID связанных данных соответствуют основным полям
    if (site.country) {
      expect(site.country_id).toBe(site.country.id);
    }

    if (site.site_type) {
      expect(site.site_type_id).toBe(site.site_type.id);
    }

    if (site.difficulty) {
      expect(site.difficulty_id).toBe(site.difficulty.id);
    }
  }
});

// Тест фильтрации с сохранением связанных данных
test('GET /dive-sites - filtering with related data preservation', async ({
  request,
}) => {
  const diveSitesApi = new DiveSitesApi(request);

  const response = await diveSitesApi.getSitesByCountry(TEST_DATA.COUNTRIES.THAILAND);
  await diveSitesApi.expectStatusCode(response, 200);

  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();

  if (data.length > 0) {
    const site = data[0];

    // Проверяем, что связанные данные присутствуют
    expect(site).toHaveProperty('country');
    expect(site).toHaveProperty('site_type');
    expect(site).toHaveProperty('difficulty');

    // Проверяем, что фильтрация работает корректно
    expect(site.country_id).toBe(TEST_DATA.COUNTRIES.THAILAND);
    if (site.country) {
      expect(site.country.id).toBe(TEST_DATA.COUNTRIES.THAILAND);
    }
  }
});

// Тест комбинированной фильтрации с связанными данными
test('GET /dive-sites - combined filtering with related data', async ({
  request,
}) => {
  const diveSitesApi = new DiveSitesApi(request);

  const response = await diveSitesApi.getSitesWithFilters({
    country_id: TEST_DATA.COUNTRIES.THAILAND,
    site_type_id: TEST_DATA.SITE_TYPES.REEF,
    difficulty_id: TEST_DATA.DIFFICULTY.BEGINNER,
  });
  await diveSitesApi.expectStatusCode(response, 200);

  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();

  if (data.length > 0) {
    const site = data[0];

    // Проверяем все связанные данные
    expect(site).toHaveProperty('country');
    expect(site).toHaveProperty('site_type');
    expect(site).toHaveProperty('difficulty');

    // Проверяем соответствие фильтрам
    expect(site.country_id).toBe(TEST_DATA.COUNTRIES.THAILAND);
    expect(site.site_type_id).toBe(TEST_DATA.SITE_TYPES.REEF);
    expect(site.difficulty_id).toBe(TEST_DATA.DIFFICULTY.BEGINNER);

    if (site.country) expect(site.country.id).toBe(TEST_DATA.COUNTRIES.THAILAND);
    if (site.site_type) expect(site.site_type.id).toBe(TEST_DATA.SITE_TYPES.REEF);
    if (site.difficulty) expect(site.difficulty.id).toBe(TEST_DATA.DIFFICULTY.BEGINNER);
  }
});
