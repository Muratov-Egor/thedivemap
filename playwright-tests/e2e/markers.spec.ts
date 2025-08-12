import { test } from '@playwright/test';
import { MarkersPage } from './page-objects/markersPage';
import { BaseSteps } from './page-objects/baseSteps';
import twoMarkersMock from '../mocks/two-markers.json';

test.describe('Desktop: Interacting with markers', () => {
  test.beforeEach(async ({ page }) => {
    const baseSteps = new BaseSteps(page);
    await baseSteps.mockApiResponse('/api/dive-sites', twoMarkersMock);
    await baseSteps.openPage();
    await baseSteps.waitForDataLoaded();
  });

  test('Click on marker should open tooltip without rating', async ({ page }) => {
    const markersPage = new MarkersPage(page);

    await markersPage.clickOnMarker('6c2daaf5-ecf5-4449-822b-60fe80f78806');
    await markersPage.expectMarkerTooltipToBeVisible();
    await markersPage.expectMarkerTooltipHaveValues(
      'Marlas Mystery',
      '7.6079°N, 98.3801°E',
      'Wreck',
    );
  });

  test('Click on marker should open tooltip with rating and close it', async ({ page }) => {
    const markersPage = new MarkersPage(page);

    await markersPage.clickOnMarker('02b914c4-c3d7-4181-badb-391ad8bf1e09');
    await markersPage.expectMarkerTooltipToBeVisible();
    await markersPage.expectMarkerTooltipHaveValues(
      'Ada Lake',
      '44.7765°N, 20.3747°E',
      'Lake',
      '⭐️ 3/5',
    );
    await markersPage.closeMarkerTooltip();
    await markersPage.expectMarkerTooltipToBeClosed();
  });
});
