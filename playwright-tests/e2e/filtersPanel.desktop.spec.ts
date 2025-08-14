import { test } from '@playwright/test';
import { FiltersPanel } from './page-objects/filtersPanel';
import { BaseSteps } from './page-objects/baseSteps';

test.describe('Desktop: Filters Panel', () => {
  test.beforeEach(async ({ page }) => {
    const baseSteps = new BaseSteps(page);
    await baseSteps.openPage();
    await baseSteps.waitForDataLoaded();
  });

  test('Desktop filters panel is always visible', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);

    await filtersPanel.expectDesktopFiltersPanelToBeVisible();
  });

  test('Button open mobile filters panel is not visible', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);

    await filtersPanel.expectButtonOpenMobileFiltersPanelIsNotVisible();
  });
});
