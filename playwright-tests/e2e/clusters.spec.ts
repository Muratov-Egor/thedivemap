import { test } from '@playwright/test';
import { BaseSteps } from './page-objects/baseSteps';
import { MarkersPage } from './page-objects/markersPage';
import montenegroDiveSitesMock from '../mocks/montenegro-dive-sites.json';

test.describe('Desktop: Interacting with clusters', () => {
  test('Click on cluster should expand it into individual markers', async ({ page }) => {
    const markersPage = new MarkersPage(page);
    const baseSteps = new BaseSteps(page);

    await baseSteps.mockApiResponse('/api/dive-sites', montenegroDiveSitesMock);
    await baseSteps.openPage();
    await baseSteps.waitForDataLoaded();

    await markersPage.assertThatClustersCountIsEqual(1);
    await markersPage.clickOnCluster();
    await page.waitForTimeout(500);
    await markersPage.assertThatClustersCountIsEqual(0);
  });
});
