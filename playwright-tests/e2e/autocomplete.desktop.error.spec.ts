import { test } from '@playwright/test';
import { BaseSteps } from './page-objects/baseSteps';
import { Autocomplete } from './page-objects/autocomplete';
import autocompleteMock from '../mocks/autocomplete.json';

test.describe('Autocomplete Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    const baseSteps = new BaseSteps(page);
    await baseSteps.openPage();
  });

  test('Should show error when API returns 500', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiError('**/api/places*', 500, 'Internal Server Error');

    await autocomplete.typeText('Wreck');

    await autocomplete.expectListToBeHidden();
    await autocomplete.expectErrorToBeVisible('HTTP error! status: 500');
  });

  test('Should show error when API returns 404', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiError('**/api/places*', 404, 'Not Found');

    await autocomplete.typeText('Wreck');

    await autocomplete.expectListToBeHidden();
    await autocomplete.expectErrorToBeVisible('HTTP error! status: 404');
  });

  test('Should show error when network is unavailable', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiNetworkError('**/api/places*');

    await autocomplete.typeText('Wreck');

    await autocomplete.expectListToBeHidden();
    await autocomplete.expectErrorToBeVisible('Failed to fetch');
  });

  test('Should handle empty API response', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    const emptyResponse = {
      sites: [],
      countries: [],
      regions: [],
      locations: [],
      errors: { countries: null, regions: null, locations: null },
    };

    await baseSteps.mockApiResponseWithPattern('**/api/places*', emptyResponse);

    await autocomplete.typeText('Wreck');

    await autocomplete.expectListToBeHidden();
  });

  test('Should handle malformed JSON response', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiMalformedJson('**/api/places*');

    await autocomplete.typeText('Wreck');

    await autocomplete.expectListToBeHidden();
    await autocomplete.expectErrorToBeVisible('Unexpected token');
  });

  test('Should recover from error when retrying search', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    // Сначала возвращаем ошибку
    await baseSteps.mockApiError('**/api/places*', 500, 'Internal Server Error');

    await autocomplete.typeText('Wreck');
    await autocomplete.expectErrorToBeVisible('HTTP error! status: 500');
    await autocomplete.clickClearButton();

    await baseSteps.mockApiResponseWithPattern('**/api/places*', autocompleteMock);

    await autocomplete.typeText('Bay');
    await autocomplete.expectListToBeVisible();
    await autocomplete.expectResultsCount(9);
  });
});
