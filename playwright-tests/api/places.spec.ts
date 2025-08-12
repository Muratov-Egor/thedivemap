import { test } from '@playwright/test';
import { BaseApiSteps } from './api-objects/baseApiSteps';
import { TEST_DATA } from './test-data';
import { PlacesApi } from './api-objects/placesApi';

test('Show an error message if no ‘q’ query parameter is specified', async ({ request }) => {
  const baseSteps = new BaseApiSteps(request);
  const response = await baseSteps.sentGetResponse('/api/places');
  await baseSteps.expectStatusCode(response, 400);
  await baseSteps.expectErrorResponse(response, 400, 'Parameter "q" is required');
});

test('Check valid sites response data structure if q is empty', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(`/api/places?q=''`);
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidSitesResponse(response);
});

test('Check valid sites response data structure if q=abc', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(`/api/places?q=a`);
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidSitesResponse(response);
});

test('Countries name in Russian if lang query dose not specified', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(
    `/api/places?q=${TEST_DATA.COUNTRIES_NAMES.EN.SERBIA}`,
  );
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidCountriesInResponse(response, {
    ...TEST_DATA.SERBIA_VALUES,
    NAME: 'Сербия',
  });
});

test('Countries name in Russian if lang=ru', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(
    `/api/places?q=${TEST_DATA.COUNTRIES_NAMES.EN.SERBIA}&lang=ru`,
  );
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidCountriesInResponse(response, {
    ...TEST_DATA.SERBIA_VALUES,
    NAME: 'Сербия',
  });
});

test('Countries name in English if lang=en', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(
    `/api/places?q=${TEST_DATA.COUNTRIES_NAMES.EN.SERBIA}&lang=en`,
  );
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidCountriesInResponse(response, {
    ...TEST_DATA.SERBIA_VALUES,
    NAME: 'Serbia',
  });
});

test('Region name in Russian if lang query dose not specified', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(
    `/api/places?q=${TEST_DATA.REGIONS_VALUES.NAME_EN}`,
  );
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidRegionsInResponse(response, {
    ...TEST_DATA.REGIONS_VALUES,
    NAME: 'Азия',
  });
});

test('Region name in Russian if lang=ru', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(
    `/api/places?q=${TEST_DATA.REGIONS_VALUES.NAME_EN}&lang=ru`,
  );
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidRegionsInResponse(response, {
    ...TEST_DATA.REGIONS_VALUES,
    NAME: 'Азия',
  });
});

test('Region name in English if lang=en', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(
    `/api/places?q=${TEST_DATA.REGIONS_VALUES.NAME_EN}&lang=en`,
  );
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidRegionsInResponse(response, {
    ...TEST_DATA.REGIONS_VALUES,
    NAME: 'Asia',
  });
});

test('Location name in Russian if lang query dose not specified', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(`/api/places?q=Racha%20Yai`);
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidLocationsInResponse(response, {
    ID: 4,
    NAME: 'Рача Яй',
  });
});

test('Location name in Russian if lang=ru', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(`/api/places?q=Racha%20Yai&lang=ru`);
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidLocationsInResponse(response, {
    ID: 4,
    NAME: 'Рача Яй',
  });
});

test('Location name in English if lang=en', async ({ request }) => {
  const placesApi = new PlacesApi(request);
  const response = await placesApi.sentGetResponse(`/api/places?q=Racha%20Yai&lang=en`);
  await placesApi.expectStatusCode(response, 200);
  await placesApi.expectValidLocationsInResponse(response, {
    ID: 4,
    NAME: 'Racha Yai',
  });
});
