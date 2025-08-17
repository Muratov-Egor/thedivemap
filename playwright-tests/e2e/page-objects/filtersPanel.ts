import { expect, Locator, Page, test } from '@playwright/test';

export class FiltersPanel {
  readonly filterPanelDesktop: Locator;
  readonly filterPanelMobile: Locator;
  readonly filtersContent: Locator;
  readonly buttonOpenMobileFiltersPanel: Locator;
  readonly buttonCloseMobileFiltersPanel: Locator;

  constructor(private page: Page) {
    this.filterPanelDesktop = page.getByTestId('desktop-filters-panel')
    this.filterPanelMobile = page.getByTestId('mobile-filters-panel')
    this.buttonOpenMobileFiltersPanel = page.getByTestId('open-filters-panel-button')
    this.filtersContent = page.getByTestId('filters-content')
    this.buttonCloseMobileFiltersPanel = page.getByTestId('close-filters-panel-button')
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
      await expect(this.filtersContent).toBeVisible();
    })
  }

  async expectMobileFiltersPanelToBeVisible() {
    await test.step('Expect that mobile filters panel to be visible', async () => {
      await expect(this.filterPanelMobile).toBeVisible();
      await expect(this.filtersContent).toBeVisible();
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
}
