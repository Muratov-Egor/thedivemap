import { test } from '@playwright/test';
import { BaseSteps } from './page-objects/baseSteps';
import autocompleteMock from '../mocks/autocomplete.json';
import { Autocomplete } from './page-objects/autocomplete';
import { FiltersPanel } from './page-objects/filtersPanel';

test.describe('Mobile: Autocomplete Info Message Tests', () => {
  test.beforeEach(async ({ page }) => {
    const baseSteps = new BaseSteps(page);
    await baseSteps.mockApiResponseWithPattern('**/api/places*', autocompleteMock);
    await baseSteps.openPage();
  });

  test('Should show info message on mobile when selecting country without dive sites', async ({
    page,
  }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiBoundsError('**/api/bounds*', 404);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await autocomplete.expectListToBeVisible(true);

    // Выбираем страну Montenegro (4-й элемент в списке: 3 дайв-сайта + 1 страна)
    await autocomplete.clickOnResultByIndex(4, true);

    await autocomplete.expectInfoMessageToBeVisible('No dive sites in Montenegro yet', true);
    await autocomplete.expectInfoMessageToContainIcon('🐠', true);
  });

  test('Should show info message on mobile when selecting region without dive sites', async ({
    page,
  }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiBoundsError('**/api/bounds*', 404);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await autocomplete.expectListToBeVisible(true);

    // Выбираем регион Europe (7-й элемент в списке)
    await autocomplete.clickOnResultByIndex(6, true);

    await autocomplete.expectInfoMessageToBeVisible('No dive sites in Europe yet', true);
    await autocomplete.expectInfoMessageToContainIcon('🐠', true);
  });

  test('Should show info message on mobile when selecting location without dive sites', async ({
    page,
  }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiBoundsError('**/api/bounds*', 404);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await autocomplete.expectListToBeVisible(true);

    // Выбираем локацию Racha Noi (9-й элемент в списке)
    await autocomplete.clickOnResultByIndex(8, true);

    await autocomplete.expectInfoMessageToBeVisible('No dive sites in Racha Noi yet', true);
    await autocomplete.expectInfoMessageToContainIcon('🐠', true);
  });

  test('Should not show info message on mobile when selecting dive site', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
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

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await autocomplete.expectListToBeVisible(true);

    // Выбираем дайв-сайт (первый элемент)
    await autocomplete.clickOnFirstResult(true);

    await autocomplete.expectInfoMessageToBeHidden(true);
  });

  test('Should auto-hide info message on mobile after 8 seconds', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiBoundsError('**/api/bounds*', 404);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await autocomplete.expectListToBeVisible(true);

    // Выбираем страну Serbia (5-й элемент в списке: 3 дайв-сайта + 2 страны)
    await autocomplete.clickOnResultByIndex(5, true);

    await autocomplete.expectInfoMessageToBeVisible('No dive sites in Serbia yet', true);

    // Ждем автоскрытия
    await page.waitForTimeout(8500);

    await autocomplete.expectInfoMessageToBeHidden(true);
  });

  test('Should close mobile filters panel and hide info message', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiBoundsError('**/api/bounds*', 404);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await autocomplete.expectListToBeVisible(true);

    // Выбираем страну Montenegro (4-й элемент в списке: 3 дайв-сайта + 1 страна)
    await autocomplete.clickOnResultByIndex(4, true);

    await autocomplete.expectInfoMessageToBeVisible('No dive sites in Montenegro yet', true);

    // Закрываем мобильную панель фильтров
    await filtersPanel.closeMobileFiltersPanel();
    await filtersPanel.expectMobileFiltersPanelIsNotExist();
  });
});
