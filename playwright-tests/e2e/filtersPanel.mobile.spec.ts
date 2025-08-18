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

    const initClusters = await markers.getClustersCount();
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.chooseSiteTypeFilterById(2);

    await filtersPanel.expectButtonCleanAllFiltersIsVisible();
    await filtersPanel.expectSiteTypeFilterActive(2);
    await filtersPanel.closeMobileFiltersPanel();
    await markers.assertThatClustersCountLessThan(initClusters);
  });

  test('Choose dive difficulty filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.chooseDifficultyFilterById(2);

    await filtersPanel.expectButtonCleanAllFiltersIsVisible();
    await filtersPanel.expectDifficultyFilterActive(2);
    await filtersPanel.closeMobileFiltersPanel();
    await markers.assertThatClustersCountLessThan(initClusters);
  });

  test('Choose dive rating filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.chooseRatingById(4);

    await filtersPanel.expectButtonCleanAllFiltersIsVisible();
    await filtersPanel.expectRatingFilterActive(4);
    await filtersPanel.closeMobileFiltersPanel();
    await markers.assertThatClustersCountLessThan(initClusters);
  });

  test('Toggle dive site type filter on/off', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.chooseSiteTypeFilterById(1);
    await filtersPanel.expectSiteTypeFilterActive(1);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();

    await filtersPanel.chooseSiteTypeFilterById(1);
    await filtersPanel.expectSiteTypeFilterNotActive(1);
    await filtersPanel.expectButtonCleanAllFiltersIsNotExist();
    await filtersPanel.closeMobileFiltersPanel();

    await markers.assertThatClustersCountIsEqual(initClusters);
  });

  test('Toggle dive difficulty filter on/off', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.chooseDifficultyFilterById(2);
    await filtersPanel.expectDifficultyFilterActive(2);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();

    await filtersPanel.chooseDifficultyFilterById(2);
    await filtersPanel.expectDifficultyFilterNotActive(2);
    await filtersPanel.expectButtonCleanAllFiltersIsNotExist();
    await filtersPanel.closeMobileFiltersPanel();

    await markers.assertThatClustersCountIsEqual(initClusters);
  });

  test('Toggle dive rating filter on/off', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.chooseRatingById(4);
    await filtersPanel.expectRatingFilterActive(4);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();

    await filtersPanel.chooseRatingById(4);
    await filtersPanel.expectRatingFilterNotActive(4);
    await filtersPanel.expectButtonCleanAllFiltersIsNotExist();
    await filtersPanel.closeMobileFiltersPanel();

    await markers.assertThatClustersCountIsEqual(initClusters);
  });

  test('Set max depth slider filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.setMaxDepthSlider(10);

    await filtersPanel.expectMaxDepthSliderValue(10);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();
    await filtersPanel.closeMobileFiltersPanel();
    await markers.assertThatClustersCountLessThan(initClusters);
  });

  test('Set min visibility slider filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.openMobileFiltersPanel();
    await filtersPanel.setMinVisibilitySlider(16);

    await filtersPanel.expectMinVisibilitySliderValue(16);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();
    await filtersPanel.closeMobileFiltersPanel();
    await markers.assertThatClustersCountLessThan(initClusters);
  });
});
