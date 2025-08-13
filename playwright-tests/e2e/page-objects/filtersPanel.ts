import { expect, test, Locator, Page } from '@playwright/test';

export class FiltersPanel {
  readonly desktopFiltersPanel: Locator;
  readonly mobileFiltersPanel: Locator;
  readonly openFiltersPanelButton: Locator;
  readonly closeFiltersPanelButton: Locator;

  constructor(private page: Page) {
    this.desktopFiltersPanel = page.getByTestId('desktop-filters-panel');
    this.mobileFiltersPanel = page.getByTestId('mobile-filters-panel');
    this.openFiltersPanelButton = page.getByTestId('open-filters-panel-button');
    this.closeFiltersPanelButton = page.getByTestId('close-filters-panel-button');
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
}
