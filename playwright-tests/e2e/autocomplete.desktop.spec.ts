import { test } from '@playwright/test';
import { BaseSteps } from './page-objects/baseSteps';
import autocompleteMock from '../mocks/autocomplete.json';
import { Autocomplete } from './page-objects/autocomplete';
import { MarkersPage } from './page-objects/markersPage';

test.describe('Desktop: Autocomplete tests', () => {
  test.beforeEach(async ({ page }) => {
    const baseSteps = new BaseSteps(page);
    await baseSteps.mockApiResponseWithPattern('**/api/places*', autocompleteMock);
    await baseSteps.openPage();
  });

  test('Should display autocomplete results when typing', async ({ page }) => {
    const autocomplete = new Autocomplete(page);

    // Мокаем медленный ответ для проверки состояния загрузки
    await page.route('**/api/places*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Задержка 2 секунды
      await route.fulfill({ json: autocompleteMock });
    });
    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeLoading();

    await autocomplete.expectListToBeVisible();
    await autocomplete.expectResultsCount(9);
  });

  test('Should show list of results when query is equal one symbol', async ({ page }) => {
    const autocomplete = new Autocomplete(page);

    await autocomplete.typeText('x');
    await page.waitForTimeout(500);

    await autocomplete.expectListToBeHidden();
  });

  test('Should clear input when clear button is clicked', async ({ page }) => {
    const autocomplete = new Autocomplete(page);

    await autocomplete.typeText('xxx');
    await autocomplete.expectSearchIconToBeHidden();
    await autocomplete.expectListToBeVisible();

    await autocomplete.clickClearButton();
    await autocomplete.expectInputToBeEmpty();
    await autocomplete.expectListToBeHidden();
  });

  test('Should select item when clicked', async ({ page }) => {
    const autocomplete = new Autocomplete(page);
    const markersPage = new MarkersPage(page);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    await autocomplete.clickOnFirstResult();

    await page.waitForTimeout(500);
    await autocomplete.expectInputToHaveValue('Bungalow Bay North Wall');
    await autocomplete.expectListToBeHidden();

    await markersPage.expectMarkerTooltipToBeVisible();
    await markersPage.expectMarkerTooltipHaveValues(
      'Bungalow Bay North Wall',
      '7.6111°N, 98.3638°E',
      'Bay',
    );
  });

  test('Should navigate with keyboard arrows', async ({ page }) => {
    const autocomplete = new Autocomplete(page);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    // Навигация вниз
    await autocomplete.pressKey('ArrowDown');
    await autocomplete.expectItemNumberToBeSelected(0);

    // Навигация вниз еще раз
    await autocomplete.pressKey('ArrowDown');
    await autocomplete.expectItemNumberToBeSelected(1);

    // Навигация вверх
    await autocomplete.pressKey('ArrowUp');
    await autocomplete.expectItemNumberToBeSelected(0);
  });

  test('Should select item with Enter key', async ({ page }) => {
    const autocomplete = new Autocomplete(page);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    await autocomplete.pressKey('ArrowDown');
    await autocomplete.pressKey('Enter');
    await autocomplete.expectInputToHaveValue('Bay 2 (Staghorn Reef)');
    await page.waitForTimeout(500);
    await autocomplete.expectListToBeHidden();
  });

  test('Should close dropdown with Escape key', async ({ page }) => {
    const autocomplete = new Autocomplete(page);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    await autocomplete.pressKey('Escape');
    await autocomplete.expectListToBeHidden();
  });

  test('Should close dropdown when clicking outside', async ({ page }) => {
    const autocomplete = new Autocomplete(page);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    await page.click('body'); // Кликаем вне autocomplete
    await autocomplete.expectListToBeHidden();
  });

  test('Should show different result types with correct icons', async ({ page }) => {
    const autocomplete = new Autocomplete(page);

    await autocomplete.typeText('xxx');
    await autocomplete.expectListToBeVisible();

    await autocomplete.expectResultTypeToBeVisible('site', '🤿');
    await autocomplete.expectResultTypeToBeVisible('country', '🇹🇭');
    await autocomplete.expectResultTypeToBeVisible('region', '🗺️');
    await autocomplete.expectResultTypeToBeVisible('location', '📍');
  });
});
