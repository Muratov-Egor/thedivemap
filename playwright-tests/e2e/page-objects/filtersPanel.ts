import { expect, Locator, Page, test } from '@playwright/test';
import { MarkersPage } from './markersPage';

export class FiltersPanel {
  readonly filterPanelDesktop: Locator;
  readonly filterPanelMobile: Locator;
  readonly filtersContent: Locator;
  readonly buttonOpenMobileFiltersPanel: Locator;
  readonly buttonCloseMobileFiltersPanel: Locator;
  readonly buttonCleanAllFilters: Locator;
  readonly siteTypeFilters: Locator;
  readonly difficultyTypeFilters: Locator;
  readonly ratingFilters: Locator;
  readonly maxDepthSlider: Locator;
  readonly minVisibilitySlider: Locator;

  constructor(private page: Page) {
    this.filterPanelDesktop = page.getByTestId('desktop-filters-panel');
    this.filterPanelMobile = page.getByTestId('mobile-filters-panel');
    this.buttonOpenMobileFiltersPanel = page.getByTestId('open-filters-panel-button');
    this.filtersContent = page.getByTestId('filters-content');
    this.buttonCloseMobileFiltersPanel = page.getByTestId('close-filters-panel-button');
    this.buttonCleanAllFilters = page.getByTestId('clear-all-filters-button');
    this.siteTypeFilters = page.getByTestId('site-type-filters');
    this.difficultyTypeFilters = page.getByTestId('difficulty-filters');
    this.ratingFilters = page.getByTestId('rating-filters');
    this.maxDepthSlider = page.getByTestId('max-depth-slider');
    this.minVisibilitySlider = page.getByTestId('min-visibility-slider');
  }

  private diveSiteTypeFilter(id: number): Locator {
    return this.page.getByTestId(`site-type-filter-${id}`);
  }

  private difficultyFilter(id: number): Locator {
    return this.page.getByTestId(`difficulty-filter-${id}`);
  }

  private ratingStar(id: number): Locator {
    return this.page.getByTestId(`rating-star-${id}`);
  }

  async openMobileFiltersPanel() {
    await test.step('Open mobile filter panel', async () => {
      await this.buttonOpenMobileFiltersPanel.click();
    });
  }

  async closeMobileFiltersPanel() {
    await test.step('Close mobile filter panel', async () => {
      await this.buttonCloseMobileFiltersPanel.click();
    });
  }

  async chooseSiteTypeFilterById(id: number) {
    await test.step('Choose site type filter', async () => {
      await this.diveSiteTypeFilter(id).click();
    });
  }

  async chooseDifficultyFilterById(id: number) {
    await test.step('Choose site type filter', async () => {
      await this.difficultyFilter(id).click();
    });
  }

  async chooseRatingById(id: number) {
    await test.step('Choose site type filter', async () => {
      await this.ratingStar(id).click();
    });
  }

  async expectDesktopFiltersPanelToBeVisible() {
    await test.step('Expect that desktop filters panel to be visible', async () => {
      await expect(this.filterPanelDesktop).toBeVisible();
      await this.expectFiltersContentIsVisible();
    });
  }

  async expectMobileFiltersPanelToBeVisible() {
    await test.step('Expect that mobile filters panel to be visible', async () => {
      await expect(this.filterPanelMobile).toBeVisible();
      await this.expectFiltersContentIsVisible();
      await this.expectButtonOpenMobileFiltersPanelIsNotExist();
    });
  }

  async expectDesktopFiltersPanelIsNotExist() {
    await test.step('Expect that desktop filters panel is not exist', async () => {
      await expect(this.filterPanelDesktop).not.toBeAttached();
    });
  }

  async expectMobileFiltersPanelIsNotExist() {
    await test.step('Expect that mobile filters panel is not exist', async () => {
      await expect(this.filterPanelMobile).not.toBeAttached();
    });
  }

  async expectButtonOpenMobileFiltersPanelIsNotExist() {
    await test.step('Expect that button open mobile panel is not exist', async () => {
      await expect(this.buttonOpenMobileFiltersPanel).not.toBeAttached();
    });
  }

  async expectFiltersContentIsVisible() {
    await test.step('Expect the all filters are visible', async () => {
      await this.filtersContent.isVisible();

      await test.step('Expect the type dive sites type filters are visible', async () => {
        await this.siteTypeFilters.isVisible();
      });

      await test.step('Expect the type difficulty filters are visible', async () => {
        await this.difficultyTypeFilters.isVisible();
      });

      await test.step('Expect the type rating filters are visible', async () => {
        await this.ratingFilters.isVisible();
      });

      await test.step('Expect the type slider max depth is visible', async () => {
        await this.maxDepthSlider.isVisible();
      });

      await test.step('Expect the type slider min visibility is visible', async () => {
        await this.minVisibilitySlider.isVisible();
      });

      await this.expectButtonCleanAllFiltersIsNotExist();
    });
  }

  async expectButtonCleanAllFiltersIsVisible() {
    await test.step('Expect that button clean all filters is visible', async () => {
      await expect(this.buttonCleanAllFilters).toBeVisible();
    });
  }

  async expectButtonCleanAllFiltersIsNotExist() {
    await test.step('Expect that button clean all filters is not exist', async () => {
      await expect(this.buttonCleanAllFilters).not.toBeAttached();
    });
  }

  async setMaxDepthSlider(value: number) {
    await test.step(`Set max depth slider to ${value}`, async () => {
      const slider = this.maxDepthSlider.locator('[role="slider"]');
      await slider.click();

      // Получаем размеры слайдера для расчета позиции
      const boundingBox = await slider.boundingBox();
      if (!boundingBox) throw new Error('Slider bounding box not found');

      // Рассчитываем позицию для нужного значения (0-50 диапазон)
      const percentage = value / 50;
      const clickX = boundingBox.x + boundingBox.width * percentage;
      const clickY = boundingBox.y + boundingBox.height / 2;

      await this.page.mouse.click(clickX, clickY);
    });
  }

  async setMinVisibilitySlider(value: number) {
    await test.step(`Set min visibility slider to ${value}`, async () => {
      const slider = this.minVisibilitySlider.locator('[role="slider"]');
      await slider.click();

      // Получаем размеры слайдера для расчета позиции
      const boundingBox = await slider.boundingBox();
      if (!boundingBox) throw new Error('Slider bounding box not found');

      // Рассчитываем позицию для нужного значения (0-30 диапазон)
      const percentage = value / 30;
      const clickX = boundingBox.x + boundingBox.width * percentage;
      const clickY = boundingBox.y + boundingBox.height / 2;

      await this.page.mouse.click(clickX, clickY);
    });
  }

  async expectMaxDepthSliderValue(value: number) {
    await test.step(`Expect max depth slider value to be ${value}`, async () => {
      const valueDisplay = this.page.getByTestId('max-depth-slider-value');
      await expect(valueDisplay).toHaveText(`${value} m`);
    });
  }

  async expectMinVisibilitySliderValue(value: number) {
    await test.step(`Expect min visibility slider value to be ${value}`, async () => {
      const valueDisplay = this.page.getByTestId('min-visibility-slider-value');
      await expect(valueDisplay).toHaveText(`${value} m`);
    });
  }

  async expectSiteTypeFilterActive(id: number) {
    await test.step(`Expect site type filter ${id} to be active`, async () => {
      const filter = this.diveSiteTypeFilter(id);
      await expect(filter).toHaveAttribute('aria-pressed', 'true');
    });
  }

  async expectDifficultyFilterActive(id: number) {
    await test.step(`Expect difficulty filter ${id} to be active`, async () => {
      const filter = this.difficultyFilter(id);
      await expect(filter).toHaveAttribute('aria-pressed', 'true');
    });
  }

  async expectRatingFilterActive(id: number) {
    await test.step(`Expect rating filter ${id} to be active`, async () => {
      const ratingStar = this.ratingStar(id);
      await expect(ratingStar).toHaveClass(/text-yellow-400/);
    });
  }

  async expectSiteTypeFilterNotActive(id: number) {
    await test.step(`Expect site type filter ${id} to be not active`, async () => {
      const filter = this.diveSiteTypeFilter(id);
      await expect(filter).toHaveAttribute('aria-pressed', 'false');
    });
  }

  async expectDifficultyFilterNotActive(id: number) {
    await test.step(`Expect difficulty filter ${id} to be not active`, async () => {
      const filter = this.difficultyFilter(id);
      await expect(filter).toHaveAttribute('aria-pressed', 'false');
    });
  }

  async expectRatingFilterNotActive(id: number) {
    await test.step(`Expect rating filter ${id} to be not active`, async () => {
      const ratingStar = this.ratingStar(id);
      await expect(ratingStar).toHaveClass(/text-gray-300/);
    });
  }
}
