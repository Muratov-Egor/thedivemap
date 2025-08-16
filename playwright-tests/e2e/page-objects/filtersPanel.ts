import { expect, test, Locator, Page } from '@playwright/test';

export class FiltersPanel {
  readonly desktopFiltersPanel: Locator;
  readonly mobileFiltersPanel: Locator;
  readonly openFiltersPanelButton: Locator;
  readonly closeFiltersPanelButton: Locator;

  // Локаторы для элементов внутри десктопной панели
  readonly desktopDifficultyFiltersBlock: Locator;
  readonly desktopSiteTypeFiltersBlock: Locator;
  readonly desktopRatingFiltersBlock: Locator;
  readonly desktopMaxDepthSlider: Locator;
  readonly desktopMinVisibilitySlider: Locator;
  readonly desktopAutocompleteInput: Locator;

  // Локаторы для элементов внутри мобильной панели
  readonly mobileDifficultyFiltersBlock: Locator;
  readonly mobileSiteTypeFiltersBlock: Locator;
  readonly mobileRatingFiltersBlock: Locator;
  readonly mobileMaxDepthSlider: Locator;
  readonly mobileMinVisibilitySlider: Locator;
  readonly mobileAutocompleteInput: Locator;

  constructor(private page: Page) {
    this.desktopFiltersPanel = page.getByTestId('desktop-filters-panel');
    this.mobileFiltersPanel = page.getByTestId('mobile-filters-panel');
    this.openFiltersPanelButton = page.getByTestId('open-filters-panel-button');
    this.closeFiltersPanelButton = page.getByTestId('close-filters-panel-button');

    // Локаторы для десктопной панели
    this.desktopDifficultyFiltersBlock = this.desktopFiltersPanel.getByTestId('difficulty-filters');
    this.desktopSiteTypeFiltersBlock = this.desktopFiltersPanel.getByTestId('site-type-filters');
    this.desktopRatingFiltersBlock = this.desktopFiltersPanel.getByTestId('rating-filters');
    this.desktopMaxDepthSlider = this.desktopFiltersPanel.getByTestId('max-depth-slider');
    this.desktopMinVisibilitySlider = this.desktopFiltersPanel.getByTestId('min-visibility-slider');
    this.desktopAutocompleteInput = this.desktopFiltersPanel.getByTestId('autocomplete-input');

    // Локаторы для мобильной панели
    this.mobileDifficultyFiltersBlock = this.mobileFiltersPanel.getByTestId('difficulty-filters');
    this.mobileSiteTypeFiltersBlock = this.mobileFiltersPanel.getByTestId('site-type-filters');
    this.mobileRatingFiltersBlock = this.mobileFiltersPanel.getByTestId('rating-filters');
    this.mobileMaxDepthSlider = this.mobileFiltersPanel.getByTestId('max-depth-slider');
    this.mobileMinVisibilitySlider = this.mobileFiltersPanel.getByTestId('min-visibility-slider');
    this.mobileAutocompleteInput = this.mobileFiltersPanel.getByTestId('autocomplete-input');
  }

  private difficultyFilter(id: number): Locator {
    return this.page.getByTestId(`difficulty-filter-${id}`);
  }

  private siteTypeFilter(id: number): Locator {
    return this.page.getByTestId(`site-type-filter-${id}`);
  }

  private ratingFilter(id: number): Locator {
    return this.page.getByTestId(`rating-star-${id}`);
  }

  // Метод для определения активной панели
  private async getActivePanel() {
    const isDesktopVisible = await this.desktopFiltersPanel.isVisible();
    const isMobileVisible = await this.mobileFiltersPanel.isVisible();

    if (isDesktopVisible && !isMobileVisible) {
      return 'desktop';
    } else if (isMobileVisible && !isDesktopVisible) {
      return 'mobile';
    } else {
      throw new Error('Не удалось определить активную панель фильтров');
    }
  }

  // Метод для получения локаторов активной панели
  private async getActivePanelLocators() {
    const activePanel = await this.getActivePanel();

    if (activePanel === 'desktop') {
      return {
        difficultyFiltersBlock: this.desktopDifficultyFiltersBlock,
        siteTypeFiltersBlock: this.desktopSiteTypeFiltersBlock,
        ratingFiltersBlock: this.desktopRatingFiltersBlock,
        maxDepthSlider: this.desktopMaxDepthSlider,
        minVisibilitySlider: this.desktopMinVisibilitySlider,
        autocompleteInput: this.desktopAutocompleteInput,
      };
    } else {
      return {
        difficultyFiltersBlock: this.mobileDifficultyFiltersBlock,
        siteTypeFiltersBlock: this.mobileSiteTypeFiltersBlock,
        ratingFiltersBlock: this.mobileRatingFiltersBlock,
        maxDepthSlider: this.mobileMaxDepthSlider,
        minVisibilitySlider: this.mobileMinVisibilitySlider,
        autocompleteInput: this.mobileAutocompleteInput,
      };
    }
  }

  async expectDesktopFiltersPanelToBeVisible() {
    await test.step(`Expect desktop filters panel to be visible`, async () => {
      await expect(this.desktopFiltersPanel).toBeVisible();
    });
  }

  async expectMobileFiltersPanelToBeVisible() {
    await test.step(`Expect mobile filters panel to be visible`, async () => {
      await expect(this.mobileFiltersPanel).toBeVisible();
    });
  }

  async expectDesktopFiltersPanelNotVisible() {
    await test.step(`Expect desktop filters panel not visible`, async () => {
      await expect(this.desktopFiltersPanel).not.toBeVisible();
    });
  }

  async expectMobileFiltersPanelNotExists() {
    await test.step(`Expect mobile filters panel not exists`, async () => {
      await expect(this.mobileFiltersPanel).not.toBeAttached();
    });
  }

  async expectButtonOpenMobileFiltersPanelIsNotVisible() {
    await test.step(`Expect button open mobile filters panel is not visible`, async () => {
      await expect(this.openFiltersPanelButton).not.toBeVisible();
    });
  }

  async openMobileFiltersPanel() {
    await test.step(`Open mobile filters panel`, async () => {
      await this.openFiltersPanelButton.click();
    });
  }

  async closeMobileFiltersPanel() {
    await test.step(`Close mobile filters panel`, async () => {
      await this.closeFiltersPanelButton.click();
    });
  }

  async expectDifficultyFilterToBeVisible(id: number) {
    await test.step(`Expect difficulty filter to be visible`, async () => {
      await expect(this.difficultyFilter(id)).toBeVisible();
    });
  }

  async expectSiteTypeFilterToBeVisible(id: number) {
    await test.step(`Expect site type filter to be visible`, async () => {
      await expect(this.siteTypeFilter(id)).toBeVisible();
    });
  }

  async expectRatingFilterToBeVisible(id: number) {
    await test.step(`Expect rating filter to be visible`, async () => {
      await expect(this.ratingFilter(id)).toBeVisible();
    });
  }

  async expectMaxDepthSliderToBeVisible() {
    await test.step(`Expect max depth slider to be visible`, async () => {
      const locators = await this.getActivePanelLocators();
      await expect(locators.maxDepthSlider).toBeVisible();
    });
  }

  async expectMinVisibilitySliderToBeVisible() {
    await test.step(`Expect min visibility slider to be visible`, async () => {
      const locators = await this.getActivePanelLocators();
      await expect(locators.minVisibilitySlider).toBeVisible();
    });
  }

  async expectAutocompleteInputToBeVisible() {
    await test.step(`Expect autocomplete input to be visible`, async () => {
      const locators = await this.getActivePanelLocators();
      await expect(locators.autocompleteInput).toBeVisible();
    });
  }

  async expectAllFiltersToBeVisible() {
    await test.step(`Expect all filters to be visible`, async () => {
      const locators = await this.getActivePanelLocators();

      await expect(locators.autocompleteInput).toBeVisible();
      await expect(locators.difficultyFiltersBlock).toBeVisible();
      await expect(locators.siteTypeFiltersBlock).toBeVisible();
      await expect(locators.ratingFiltersBlock).toBeVisible();
      await expect(locators.maxDepthSlider).toBeVisible();
      await expect(locators.minVisibilitySlider).toBeVisible();
    });
  }
}
