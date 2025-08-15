import { test } from '@playwright/test';
import { BaseSteps } from './page-objects/baseSteps';
import autocompleteMock from '../mocks/autocomplete.json';
import { Autocomplete } from './page-objects/autocomplete';

test.describe('Desktop: Autocomplete Info Message Tests', () => {
  test.beforeEach(async ({ page }) => {
    const baseSteps = new BaseSteps(page);
    await baseSteps.mockApiResponseWithPattern('**/api/places*', autocompleteMock);
    await baseSteps.openPage();
  });

  test('Should show info message when selecting country without dive sites', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiBoundsError('**/api/bounds*', 404);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    // Выбираем страну Montenegro (4-й элемент в списке: 3 дайв-сайта + 1 страна)
    await autocomplete.clickOnResultByIndex(4);

    await autocomplete.expectInfoMessageToBeVisible('No dive sites in Montenegro yet');
    await autocomplete.expectInfoMessageToContainIcon('🐠');
  });

  test('Should show info message when selecting region without dive sites', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiBoundsError('**/api/bounds*', 404);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    // Выбираем регион Europe (7-й элемент в списке: 3 дайв-сайта + 3 страны + 1 регион)
    await autocomplete.clickOnResultByIndex(6);

    await autocomplete.expectInfoMessageToBeVisible('No dive sites in Europe yet');
    await autocomplete.expectInfoMessageToContainIcon('🐠');
  });

  test('Should show info message when selecting location without dive sites', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiBoundsError('**/api/bounds*', 404);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    // Выбираем локацию Racha Noi (9-й элемент в списке: 3 дайв-сайта + 3 страны + 1 регион + 2 локации)
    await autocomplete.clickOnResultByIndex(8);

    await autocomplete.expectInfoMessageToBeVisible('No dive sites in Racha Noi yet');
    await autocomplete.expectInfoMessageToContainIcon('🐠');
  });

  test('Should not show info message when selecting dive site', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    // Мокаем успешный ответ для дайв-сайта
    await baseSteps.mockApiResponseWithPattern('**/api/dive-sites*', [
      {
        id: 'f94ad19a-cec4-4a2d-b230-4d517f9fc184',
        name: 'Bungalow Bay North Wall',
        latitude: 7.6111,
        longitude: 98.3638,
      },
    ]);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    // Выбираем дайв-сайт (первый элемент)
    await autocomplete.clickOnFirstResult();

    await autocomplete.expectInfoMessageToBeHidden();
  });

  test('Should auto-hide info message after 8 seconds', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiBoundsError('**/api/bounds*', 404);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    // Выбираем страну Serbia (5-й элемент в списке: 3 дайв-сайта + 2 страны)
    await autocomplete.clickOnResultByIndex(5);

    await autocomplete.expectInfoMessageToBeVisible('No dive sites in Serbia yet');

    // Ждем автоскрытия
    await page.waitForTimeout(8500);

    await autocomplete.expectInfoMessageToBeHidden();
  });

  test('Should show info message with correct description text', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiBoundsError('**/api/bounds*', 404);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    // Выбираем страну Montenegro (4-й элемент в списке: 3 дайв-сайта + 1 страна)
    await autocomplete.clickOnResultByIndex(4);

    await autocomplete.expectInfoMessageToBeVisible('No dive sites in Montenegro yet');
    await autocomplete.expectInfoMessageToContainIcon('🐠');
  });
});
