import { test } from '@playwright/test';
import { FiltersPanel } from './page-objects/filtersPanel';
import { BaseSteps } from './page-objects/baseSteps';

test.describe('Mobile: Filters Panel', () => {
  test.beforeEach(async ({ page }) => {
    const baseSteps = new BaseSteps(page);
    await baseSteps.openPage();
    await baseSteps.waitForDataLoaded();
  });

  test('Open mobile filters panel after click on open button', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);

    await filtersPanel.expectDesktopFiltersPanelIsNotExist();
    await filtersPanel.expectMobileFiltersPanelIsNotExist();
    await filtersPanel.openMobileFiltersPanel();

    await filtersPanel.expectMobileFiltersPanelToBeVisible();
  });

  test('Close mobile filters panel after click on close button', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);

    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.expectMobileFiltersPanelToBeVisible();
    await filtersPanel.closeMobileFiltersPanel();
    await filtersPanel.expectMobileFiltersPanelIsNotExist();
  });
});
