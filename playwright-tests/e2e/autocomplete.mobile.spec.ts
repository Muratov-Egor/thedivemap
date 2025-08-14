import { test } from '@playwright/test';
import { BaseSteps } from './page-objects/baseSteps';
import autocompleteMock from '../mocks/autocomplete.json';
import { Autocomplete } from './page-objects/autocomplete';
import { FiltersPanel } from './page-objects/filtersPanel';

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
    await autocomplete.expectSearchIconToBeVisible();
  });

  test('Should display autocomplete results on mobile when typing', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx');

    await autocomplete.expectListToBeVisible();
    await autocomplete.expectResultsCount(9);
  });

  test('Should handle touch interactions on mobile', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx');
    await autocomplete.expectSearchIconToBeHidden();
    await autocomplete.expectListToBeVisible();

    // Выбираем первый результат
    await autocomplete.clickOnFirstResult();
    await autocomplete.expectInputToHaveValue('Bungalow Bay North Wall');
    await autocomplete.expectListToBeHidden();
  });

  test('Should close mobile filters panel and hide autocomplete', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx');
    await autocomplete.expectSearchIconToBeHidden();
    await autocomplete.expectListToBeVisible();

    await filtersPanel.closeMobileFiltersPanel();
    await filtersPanel.expectMobileFiltersPanelNotExists();
  });

  test('Should handle keyboard navigation on mobile', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    // Навигация с клавиатуры
    await autocomplete.pressKey('ArrowDown');
    await autocomplete.expectItemNumberToBeSelected(0);
    await autocomplete.pressKey('Enter');
    await autocomplete.expectInputToHaveValue('Bungalow Bay North Wall');
  });

  test('Should show loading state on mobile', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeLoading();
  });

  test('Should clear input on mobile', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const autocomplete = new Autocomplete(page);

    await filtersPanel.openMobileFiltersPanel();
    await autocomplete.typeText('xxx');
    await page.waitForTimeout(1000);
    await autocomplete.expectListToBeVisible();

    await autocomplete.clickClearButton();
    await autocomplete.expectInputToBeEmpty();
    await autocomplete.expectListToBeHidden();
  });
});
