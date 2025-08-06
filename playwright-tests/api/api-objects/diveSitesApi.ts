import { APIRequestContext, APIResponse, expect, test } from '@playwright/test';
import { BaseApiSteps } from './baseApiSteps';

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
        expect(site).toHaveProperty('id');
        expect(site).toHaveProperty('name');
        expect(site).toHaveProperty('latitude');
        expect(site).toHaveProperty('longitude');
        expect(site).toHaveProperty('country_id');
        expect(site).toHaveProperty('depth_max');
        expect(site).toHaveProperty('visibility');
        expect(site).toHaveProperty('rating');
        expect(site).toHaveProperty('site_type_id');
        expect(site).toHaveProperty('difficulty_id');
        expect(site).toHaveProperty('status');
      }
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
      expect(typeof site.name).toBe('string');
      expect(typeof site.latitude).toBe('number');
      expect(typeof site.longitude).toBe('number');
      expect(typeof site.depth_max).toBe('number');
      expect(typeof site.visibility).toBe('number');
      expect(typeof site.rating).toBe('number');
      expect(['draft', 'published', 'rejected']).toContain(site.status);
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
