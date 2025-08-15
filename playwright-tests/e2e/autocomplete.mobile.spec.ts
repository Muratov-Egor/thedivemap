import { test } from '@playwright/test';
import { BaseSteps } from './page-objects/baseSteps';
import autocompleteMock from '../mocks/autocomplete.json';
import { Autocomplete } from './page-objects/autocomplete';
import { FiltersPanel } from './page-objects/filtersPanel';
import { MarkersPage } from './page-objects/markersPage';

test.describe('Mobile: Autocomplete tests', () => {
  test.beforeEach(async ({ page }) => {
    const baseSteps = new BaseSteps(page);
    await baseSteps.mockApiResponseWithPattern('**/api/places*', autocompleteMock);
    await baseSteps.openPage();
  });

  test('Should open mobile filters panel and display autocomplete', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.expectMobileFiltersPanelToBeVisible();
    await autocomplete.expectSearchIconToBeVisible(true);
  });

  test('Should display autocomplete results on mobile when typing', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);

    await autocomplete.expectListToBeVisible(true);
    await autocomplete.expectResultsCount(9, true);
  });

  test('Should handle touch interactions on mobile', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);
    const markersPage = new MarkersPage(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await autocomplete.expectSearchIconToBeHidden(true);
    await autocomplete.expectListToBeVisible(true);

    // Выбираем первый результат
    await autocomplete.clickOnFirstResult(true);
    await autocomplete.expectInputToHaveValue('Bungalow Bay North Wall', true);
    await autocomplete.expectListToBeHidden(true);

    await filtersPanel.closeMobileFiltersPanel();
    await markersPage.expectMarkerTooltipToBeVisible();
    await markersPage.expectMarkerTooltipHaveValues(
      'Bungalow Bay North Wall',
      '7.6111°N, 98.3638°E',
      'Bay',
    );
  });

  test('Should close mobile filters panel and hide autocomplete', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await autocomplete.expectSearchIconToBeHidden(true);
    await autocomplete.expectListToBeVisible(true);

    await filtersPanel.closeMobileFiltersPanel();
    await filtersPanel.expectMobileFiltersPanelNotExists();
  });

  test('Should handle keyboard navigation on mobile', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await autocomplete.expectListToBeVisible(true);

    // Навигация с клавиатуры
    await autocomplete.pressKey('ArrowDown', true);
    await autocomplete.expectItemNumberToBeSelected(0, true);
    await autocomplete.pressKey('Enter', true);
    await autocomplete.expectInputToHaveValue('Bay 2 (Staghorn Reef)', true);
  });

  test('Should show loading state on mobile', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await autocomplete.expectListToBeLoading(true);
  });

  test('Should clear input on mobile', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx', true);
    await page.waitForTimeout(1000);
    await autocomplete.expectListToBeVisible(true);

    await autocomplete.clickClearButton(true);
    await autocomplete.expectInputToBeEmpty(true);
    await autocomplete.expectListToBeHidden(true);
  });
});
