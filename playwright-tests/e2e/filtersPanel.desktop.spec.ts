import { test } from '@playwright/test';
import { FiltersPanel } from './page-objects/filtersPanel';
import { BaseSteps } from './page-objects/baseSteps';
import allDiveSites from '../mocks/all-dive-sites.json';
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

    const initClusters = await markers.getClustersCount();
    await filtersPanel.chooseSiteTypeFilterById(1);

    await filtersPanel.expectSiteTypeFilterActive(1);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();
    await markers.assertThatClustersCountLessThan(initClusters);
  });

  test('Choose dive difficulty filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.chooseDifficultyFilterById(2);

    await filtersPanel.expectDifficultyFilterActive(2);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();
    await markers.assertThatClustersCountLessThan(initClusters);
  });

  test('Choose dive rating filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.chooseRatingById(4);

    await filtersPanel.expectRatingFilterActive(4);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();
    await markers.assertThatClustersCountLessThan(initClusters);
  });

  test('Toggle dive site type filter on/off', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    // Выбираем фильтр
    await filtersPanel.chooseSiteTypeFilterById(1);
    await filtersPanel.expectSiteTypeFilterActive(1);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();

    // Снимаем фильтр
    await filtersPanel.chooseSiteTypeFilterById(1);
    await filtersPanel.expectSiteTypeFilterNotActive(1);
    await filtersPanel.expectButtonCleanAllFiltersIsNotExist();

    await markers.assertThatClustersCountIsEqual(initClusters);
  });

  test('Toggle difficulty filter on/off', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    // Выбираем фильтр
    await filtersPanel.chooseDifficultyFilterById(2);
    await filtersPanel.expectDifficultyFilterActive(2);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();

    // Снимаем фильтр
    await filtersPanel.chooseDifficultyFilterById(2);
    await filtersPanel.expectDifficultyFilterNotActive(2);
    await filtersPanel.expectButtonCleanAllFiltersIsNotExist();

    await markers.assertThatClustersCountIsEqual(initClusters);
  });

  test('Toggle rating filter on/off', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();

    // Выбираем фильтр
    await filtersPanel.chooseRatingById(4);
    await filtersPanel.expectRatingFilterActive(4);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();

    // Снимаем фильтр
    await filtersPanel.chooseRatingById(4);
    await filtersPanel.expectRatingFilterNotActive(4);
    await filtersPanel.expectButtonCleanAllFiltersIsNotExist();

    await markers.assertThatClustersCountIsEqual(initClusters);
  });

  test('Set max depth slider filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.setMaxDepthSlider(10);

    await filtersPanel.expectMaxDepthSliderValue(10);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();
    await markers.assertThatClustersCountLessThan(initClusters);
  });

  test('Set min visibility slider filter', async ({ page }) => {
    const filtersPanel = new FiltersPanel(page);
    const markers = new MarkersPage(page);

    const initClusters = await markers.getClustersCount();
    await filtersPanel.setMinVisibilitySlider(16);

    await filtersPanel.expectMinVisibilitySliderValue(16);
    await filtersPanel.expectButtonCleanAllFiltersIsVisible();
    await markers.assertThatClustersCountLessThan(initClusters);
  });
});
