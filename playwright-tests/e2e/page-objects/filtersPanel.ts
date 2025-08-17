import { expect, Locator, Page, test } from '@playwright/test';

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
    this.filterPanelDesktop = page.getByTestId('desktop-filters-panel')
    this.filterPanelMobile = page.getByTestId('mobile-filters-panel')
    this.buttonOpenMobileFiltersPanel = page.getByTestId('open-filters-panel-button')
    this.filtersContent = page.getByTestId('filters-content')
    this.buttonCloseMobileFiltersPanel = page.getByTestId('close-filters-panel-button')
    this.buttonCleanAllFilters = page.getByTestId('clear-all-filters-button')
    this.siteTypeFilters = page.getByTestId('site-type-filters')
    this.difficultyTypeFilters = page.getByTestId('difficulty-filters')
    this.ratingFilters = page.getByTestId('rating-filters')
    this.maxDepthSlider = page.getByTestId('max-depth-slider')
    this.minVisibilitySlider = page.getByTestId('min-visibility-slider')
  }

  private diveSiteTypeFilter(id: string): Locator {
    return this.page.getByTestId(`site-type-filter-${id}`);
  }

  private difficultyFilter(id: string): Locator {
    return this.page.getByTestId(`difficulty-filter-${id}`);
  }

  private ratingStar(id: string): Locator {
    return this.page.getByTestId(`rating-star-${id}`);
  }

  async openMobileFiltersPanel() {
    await test.step('Open mobile filter panel', async () => {
      await this.buttonOpenMobileFiltersPanel.click();
    })
  }

  async closeMobileFiltersPanel() {
    await test.step('Close mobile filter panel', async () => {
      await this.buttonCloseMobileFiltersPanel.click();
    })
  }

  async expectDesktopFiltersPanelToBeVisible() {
    await test.step('Expect that desktop filters panel to be visible', async () => {
      await expect(this.filterPanelDesktop).toBeVisible();
      await this.expectFiltersContentIsVisible()
    })
  }

  async expectMobileFiltersPanelToBeVisible() {
    await test.step('Expect that mobile filters panel to be visible', async () => {
      await expect(this.filterPanelMobile).toBeVisible();
      await this.expectFiltersContentIsVisible()
      await this.expectButtonOpenMobileFiltersPanelIsNotExist()
    })
  }

  async expectDesktopFiltersPanelIsNotExist() {
    await test.step('Expect that desktop filters panel is not exist', async () => {
      await expect(this.filterPanelDesktop).not.toBeAttached()
    })
  }

  async expectMobileFiltersPanelIsNotExist() {
    await test.step('Expect that mobile filters panel is not exist', async () => {
      await expect(this.filterPanelMobile).not.toBeAttached()
    })
  }

  async expectButtonOpenMobileFiltersPanelIsNotExist() {
    await test.step('Expect that button open mobile panel is not exist', async () => {
      await expect(this.buttonOpenMobileFiltersPanel).not.toBeAttached();
    })
  }

  async expectFiltersContentIsVisible() {
    await test.step('Expect the all filters are visible', async () => {
      await this.filtersContent.isVisible();

      await test.step('Expect the type dive sites type filters are visible', async () => {
        await this.siteTypeFilters.isVisible();
      })

      await test.step('Expect the type difficulty filters are visible', async () => {
        await this.difficultyTypeFilters.isVisible();
      })

      await test.step('Expect the type rating filters are visible', async () => {
        await this.ratingFilters.isVisible();
      })

      await test.step('Expect the type slider max depth is visible', async () => {
        await this.maxDepthSlider.isVisible();
      })

      await test.step('Expect the type slider min visibility is visible', async () => {
        await this.minVisibilitySlider.isVisible();
      })

      await this.expectButtonCleanAllFiltersIsNotExist()
    })
  }

  async expectButtonCleanAllFiltersIsVisible() {
    await test.step('Expect that button clean all filters is visible', async () => {
      await expect(this.buttonCleanAllFilters).toBeVisible();
    })
  }

  async expectButtonCleanAllFiltersIsNotExist() {
    await test.step('Expect that button clean all filters is not exist', async () => {
      await expect(this.buttonCleanAllFilters).not.toBeAttached()
    })
  }
}
