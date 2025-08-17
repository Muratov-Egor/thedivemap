import { test } from '@playwright/test';
import { FiltersPanel } from './page-objects/filtersPanel';
import { BaseSteps } from './page-objects/baseSteps';
import { MarkersPage } from './page-objects/markersPage';
import allDiveSites from '../mocks/all-dive-sites.json';

test.describe('Mobile: Filters Panel', () => {
  test.beforeEach(async ({ page }) => {
    const baseSteps = new BaseSteps(page);
    await baseSteps.mockApiResponse('/api/dive-sites', allDiveSites);
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

  test('Choose dive site type filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount()
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.chooseSiteTypeFilterById(2);

    await filtersPanel.expectButtonCleanAllFiltersIsVisible()
    await filtersPanel.closeMobileFiltersPanel();
    await markers.assertThatClustersCountLessThan(initClusters);
  })

  test('Choose dive difficulty filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount()
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.chooseDifficultyFilterById(2);

    await filtersPanel.expectButtonCleanAllFiltersIsVisible()
    await markers.assertThatClustersCountLessThan(initClusters);
  })

  test('Choose dive rating filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount()
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.chooseRatingById(4);

    await filtersPanel.expectButtonCleanAllFiltersIsVisible()
    await markers.assertThatClustersCountLessThan(initClusters);
  })
});
