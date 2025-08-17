import { test } from '@playwright/test';
import { FiltersPanel } from './page-objects/filtersPanel';
import { BaseSteps } from './page-objects/baseSteps';
import allDiveSites from '../mocks/all-dive-sites.json'
import { MarkersPage } from './page-objects/markersPage';

test.describe('Desktop: Filters Panel', () => {
  test.beforeEach(async ({ page }) => {
    const baseSteps = new BaseSteps(page);
    await baseSteps.mockApiResponse('/api/dive-sites', allDiveSites);
    await baseSteps.openPage();
    await baseSteps.waitForDataLoaded();
  });

  test('Desktop filters panel is visible', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);

    await filtersPanel.expectDesktopFiltersPanelToBeVisible();
    await filtersPanel.expectMobileFiltersPanelIsNotExist();
  });

  test('Button open mobile filters panel is not visible', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);

    await filtersPanel.expectButtonOpenMobileFiltersPanelIsNotExist();
  });

  test('Choose dive site type filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount()
    await filtersPanel.chooseSiteTypeFilterById(1);

    await filtersPanel.expectButtonCleanAllFiltersIsVisible()
    await markers.assertThatClustersCountLessThan(initClusters);
  })

  test('Choose dive difficulty filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount()
    await filtersPanel.chooseDifficultyFilterById(2);

    await filtersPanel.expectButtonCleanAllFiltersIsVisible()
    await markers.assertThatClustersCountLessThan(initClusters);
  })

  test('Choose dive rating filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount()
    await filtersPanel.chooseRatingById(4);

    await filtersPanel.expectButtonCleanAllFiltersIsVisible()
    await markers.assertThatClustersCountLessThan(initClusters);
  })
});
