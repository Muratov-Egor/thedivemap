import { APIRequestContext, APIResponse, expect, test } from '@playwright/test';
import { BaseApiSteps } from './baseApiSteps';
import {
  EXPECTED_DIVE_SITE_FIELDS,
  DIVE_SITE_FIELD_TYPES,
  DIVE_SITE_STATUSES,
} from './api-schemas';

export class DiveSitesApi extends BaseApiSteps {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getAllSites(): Promise<APIResponse> {
    return await test.step('Get all dive sites', async () => {
      return await this.sentGetResponse('/api/dive-sites');
    });
  }

  async getSitesWithFilters(filters: Record<string, string | number>): Promise<APIResponse> {
    return await test.step(`Get dive sites with filters: ${JSON.stringify(filters)}`, async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      const endpoint = `/api/dive-sites?${params.toString()}`;
      return await this.sentGetResponse(endpoint);
    });
  }

  async getSiteById(siteId: string): Promise<APIResponse> {
    return await test.step(`Get dive site by ID: ${siteId}`, async () => {
      return await this.sentGetResponse(`/api/dive-sites?id=${siteId}`);
    });
  }

  async getSitesByCountry(countryId: number): Promise<APIResponse> {
    return await test.step(`Get dive sites by country ID: ${countryId}`, async () => {
      return await this.sentGetResponse(`/api/dive-sites?country_id=${countryId}`);
    });
  }

  async getSitesByRegion(regionId: number): Promise<APIResponse> {
    return await test.step(`Get dive sites by region ID: ${regionId}`, async () => {
      return await this.sentGetResponse(`/api/dive-sites?region_id=${regionId}`);
    });
  }

  async getSitesByLocation(locationId: number): Promise<APIResponse> {
    return await test.step(`Get dive sites by location ID: ${locationId}`, async () => {
      return await this.sentGetResponse(`/api/dive-sites?location_id=${locationId}`);
    });
  }

  async getSitesByType(siteTypeId: number): Promise<APIResponse> {
    return await test.step(`Get dive sites by type ID: ${siteTypeId}`, async () => {
      return await this.sentGetResponse(`/api/dive-sites?site_type_id=${siteTypeId}`);
    });
  }

  async getSitesByDifficulty(difficultyId: number): Promise<APIResponse> {
    return await test.step(`Get dive sites by difficulty ID: ${difficultyId}`, async () => {
      return await this.sentGetResponse(`/api/dive-sites?difficulty_id=${difficultyId}`);
    });
  }

  async getSitesByStatus(status: 'draft' | 'published' | 'rejected'): Promise<APIResponse> {
    return await test.step(`Get dive sites by status: ${status}`, async () => {
      return await this.sentGetResponse(`/api/dive-sites?status=${status}`);
    });
  }

  async getSitesWithMinDepth(depthMin: number): Promise<APIResponse> {
    return await test.step(`Get dive sites with minimum depth: ${depthMin}`, async () => {
      return await this.sentGetResponse(`/api/dive-sites?depth_min=${depthMin}`);
    });
  }

  async getSitesWithMinVisibility(visibilityMin: number): Promise<APIResponse> {
    return await test.step(`Get dive sites with minimum visibility: ${visibilityMin}`, async () => {
      return await this.sentGetResponse(`/api/dive-sites?visibility_min=${visibilityMin}`);
    });
  }

  async getSitesWithMinRating(ratingMin: number): Promise<APIResponse> {
    return await test.step(`Get dive sites with minimum rating: ${ratingMin}`, async () => {
      return await this.sentGetResponse(`/api/dive-sites?rating_min=${ratingMin}`);
    });
  }

  async expectValidSitesResponse(response: APIResponse): Promise<void> {
    await test.step('Check valid sites response data structure', async () => {
      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      if (data.length > 0) {
        const site = data[0];
        await this.expectValidDiveSiteStructure(site);
      }
    });
  }

  /**
   * Проверяет, что объект содержит только ожидаемые поля
   * @param obj - объект для проверки
   * @param expectedFields - массив ожидаемых полей (по умолчанию использует EXPECTED_DIVE_SITE_FIELDS)
   */
  private expectNoExtraFields(
    obj: any,
    expectedFields: readonly string[] = EXPECTED_DIVE_SITE_FIELDS,
  ): void {
    const actualFields = Object.keys(obj);
    const unexpectedFields = actualFields.filter((field) => !expectedFields.includes(field));

    if (unexpectedFields.length > 0) {
      throw new Error(`Объект содержит неожиданные поля: ${unexpectedFields.join(', ')}`);
    }

    // Дополнительная проверка точного количества полей
    expect(actualFields).toHaveLength(expectedFields.length);
  }

  /**
   * Проверяет структуру dive site объекта на соответствие ожидаемой схеме
   * @param site - объект dive site для проверки
   */
  async expectValidDiveSiteStructure(site: any): Promise<void> {
    await test.step('Validate dive site structure', async () => {
      // Проверяем наличие всех обязательных полей
      EXPECTED_DIVE_SITE_FIELDS.forEach((field) => {
        expect(site).toHaveProperty(field);
      });

      // Проверяем отсутствие лишних полей
      this.expectNoExtraFields(site);

      // Проверяем типы данных
      await this.expectPropertyType(site, 'name', 'string');
      await this.expectPropertyType(site, 'latitude', 'number');
      await this.expectPropertyType(site, 'longitude', 'number');
      await this.expectPropertyType(site, 'country_id', 'number');
      await this.expectPropertyType(site, 'depth_max', 'number');
      await this.expectPropertyType(site, 'visibility', 'number');
      await this.expectPropertyType(site, 'rating', 'number');
      await this.expectPropertyType(site, 'site_type_id', 'number');
      await this.expectPropertyType(site, 'difficulty_id', 'number');
      await this.expectArrayContains([...DIVE_SITE_STATUSES], site.status);
      await this.expectPropertyIsNullable(site, 'description', 'string');
      await this.expectPropertyIsNullable(site, 'info_links', 'array');
      await this.expectPropertyIsNullable(site, 'dive_center_links', 'array');
      await this.expectPropertyType(site, 'created_at', 'string');
      await this.expectPropertyType(site, 'country', 'object');
      await this.expectPropertyType(site, 'site_type', 'object');
      await this.expectPropertyType(site, 'difficulty', 'object');
    });
  }

  async expectSitesCount(response: APIResponse, expectedCount: number): Promise<void> {
    await test.step(`Dive sites count should be ${expectedCount}`, async () => {
      const data = await response.json();
      expect(data).toHaveLength(expectedCount);
    });
  }

  async expectSiteProperties(response: APIResponse, siteId: string): Promise<void> {
    await test.step(`Check dive site properties with ID: ${siteId}`, async () => {
      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      const site = data.find((s: any) => s.id === siteId);
      expect(site).toBeDefined();
      expect(site.id).toBe(siteId);

      await this.expectValidDiveSiteStructure(site);
    });
  }

  async expectFilteredResults(
    response: APIResponse,
    filterType: string,
    filterValue: any,
  ): Promise<void> {
    await test.step(`Check filtered results by ${filterType}: ${filterValue}`, async () => {
      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      if (data.length > 0) {
        // Проверяем, что все результаты соответствуют фильтру
        data.forEach((site: any) => {
          switch (filterType) {
            case 'country_id':
              expect(site.country_id).toBe(filterValue);
              break;
            case 'site_type_id':
              expect(site.site_type_id).toBe(filterValue);
              break;
            case 'difficulty_id':
              expect(site.difficulty_id).toBe(filterValue);
              break;
            case 'status':
              expect(site.status).toBe(filterValue);
              break;
            case 'depth_min':
              expect(site.depth_max).toBeGreaterThanOrEqual(filterValue);
              break;
            case 'visibility_min':
              expect(site.visibility).toBeGreaterThanOrEqual(filterValue);
              break;
            case 'rating_min':
              expect(site.rating).toBeGreaterThanOrEqual(filterValue);
              break;
          }
        });
      }
    });
  }
}
