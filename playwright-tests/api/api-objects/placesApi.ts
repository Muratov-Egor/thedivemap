import { Country } from './../../../src/lib/types/supabase';
import { APIRequestContext, APIResponse, expect, test } from '@playwright/test';
import { BaseApiSteps } from './baseApiSteps';
import { TEST_DATA } from '../test-data';

export class PlacesApi extends BaseApiSteps {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async expectValidSitesResponse(response: APIResponse): Promise<void> {
    await test.step('Check valid sites response data structure', async () => {
      const data = await response.json();
      await this.expectDataToHaveProperty(data, 'sites');
      await this.expectDataToHaveProperty(data, 'countries');
      await this.expectDataToHaveProperty(data, 'regions');
      await this.expectDataToHaveProperty(data, 'locations');
      await this.expectDataToHaveProperty(data, 'errors');
      await this.expectDataToHaveProperty(data.errors, 'countries');
      await this.expectDataToHaveProperty(data.errors, 'regions');
      await this.expectDataToHaveProperty(data.errors, 'locations');
    });
  }

  async expectValidDiveSitesInResponse(response: APIResponse, diveSite: any, lang?: string): Promise<void> {
    await test.step('Check valid dive sites in response', async () => {
      const data = await response.json();
      const currentLang = lang || 'ru';
      const diveSiteData = data.sites[0];

      await this.expectDataToHaveProperty(diveSiteData, 'id');
      await this.expectDataToHaveProperty(diveSiteData, 'name');
      await this.expectDataToHaveProperty(diveSiteData, 'country');
      await this.expectDataToHaveProperty(diveSiteData, 'site_type');
      await this.expectDataToHaveProperty(diveSiteData, 'site_locations');

      await this.expectPropertiesIsEqual(diveSiteData.id, diveSite.ID);
      await this.expectPropertiesIsEqual(diveSiteData.name, diveSite.NAME);
      await this.expectPropertiesIsEqual(diveSiteData.country.region[`name_${currentLang}`], diveSite.REGION_NAME_RU);
      await this.expectPropertiesIsEqual(diveSiteData.country[`name_${currentLang}`], diveSite.COUNTRY_NAME_RU);
      await this.expectPropertiesIsEqual(diveSiteData.site_type[`label_${currentLang}`], diveSite.SITE_TYPE_LABEL_RU);
      await this.expectPropertiesIsEqual(diveSiteData.site_locations[0].location[`name_${currentLang}`], diveSite.LOCATION_NAME_RU);
    });
  }

  async expectValidCountriesInResponse(response: APIResponse, country: any ): Promise<void> {
    await test.step('Check valid countries in response', async () => {
      const data = await response.json();
      const countryData = data.countries[0];
      await this.expectDataToHaveProperty(countryData, 'id');
      await this.expectDataToHaveProperty(countryData, 'name_ru');
      await this.expectDataToHaveProperty(countryData, 'iso_code');
      await this.expectDataToHaveProperty(countryData, 'name');
      await this.expectDataToHaveProperty(countryData, 'name_en');

      await this.expectPropertiesIsEqual(countryData.id, country.ID);
      await this.expectPropertiesIsEqual(countryData.name_ru, country.NAME_RU);
      await this.expectPropertiesIsEqual(countryData.iso_code, country.ISO_CODE);
      await this.expectPropertiesIsEqual(countryData.name, country.NAME);
      await this.expectPropertiesIsEqual(countryData.name_en, country.NAME_EN);
    });
  }

  async expectValidRegionsInResponse(response: APIResponse, region: any ): Promise<void> {
    await test.step('Check valid regions in response', async () => {
      const data = await response.json();
      const regionData = data.regions[0];
      await this.expectDataToHaveProperty(regionData, 'id');
      await this.expectDataToHaveProperty(regionData, 'name_ru');
      await this.expectDataToHaveProperty(regionData, 'name_en');
      await this.expectDataToHaveProperty(regionData, 'name');

      await this.expectPropertiesIsEqual(regionData.id, region.ID);
      await this.expectPropertiesIsEqual(regionData.name_ru, region.NAME_RU);
      await this.expectPropertiesIsEqual(regionData.name_en, region.NAME_EN);
      await this.expectPropertiesIsEqual(regionData.name, region.NAME);
    });
  }

  async expectValidLocationsInResponse(response: APIResponse, location: any ): Promise<void> {
    await test.step('Check valid locations in response', async () => {
      const data = await response.json();
      const locationData = data.locations[0];
      await this.expectDataToHaveProperty(locationData, 'id');
      await this.expectDataToHaveProperty(locationData, 'name');

      await this.expectPropertiesIsEqual(locationData.id, location.ID);
      await this.expectPropertiesIsEqual(locationData.name, location.NAME);
    });
  }
}
