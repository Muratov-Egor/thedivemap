import { Page, expect, test, Locator } from '@playwright/test';
import { BaseSteps } from './baseSteps';

export class MarkersPage extends BaseSteps {
  readonly markerTooltip: Locator;
  readonly markerTooltipName: Locator;
  readonly markerTooltipCoordinates: Locator;
  readonly markerTooltipType: Locator;
  readonly markerTooltipDepth: Locator;
  readonly markerTooltipVisibility: Locator;
  readonly markerTooltipClose: Locator;
  readonly cluster: Locator;
  readonly buttonReadMore: Locator;

  constructor(page: Page) {
    super(page);
    this.markerTooltip = page.getByTestId('dive-site-tooltip');
    this.markerTooltipName = page.getByTestId('dive-site-tooltip-name');
    this.markerTooltipCoordinates = page.getByTestId('dive-site-tooltip-coordinates');
    this.markerTooltipType = page.getByTestId('dive-site-tooltip-type');
    this.markerTooltipDepth = page.getByTestId('dive-site-tooltip-depth');
    this.markerTooltipVisibility = page.getByTestId('dive-site-tooltip-visibility');
    this.markerTooltipClose = page.getByTestId('dive-site-tooltip-close');
    this.cluster = page.getByTestId('marker-cluster');
    this.buttonReadMore = page.getByTestId('dive-site-tooltip-more-button');
  }

  private marker(id: string): Locator {
    return this.page.getByTestId(`dive-site-marker-${id}`);
  }

  async clickOnMarker(id: string) {
    await test.step(`Click on marker ${id}`, async () => {
      await this.marker(id).click();
    });
  }

  async closeMarkerTooltip() {
    await test.step(`Close marker tooltip`, async () => {
      await this.markerTooltipClose.click();
    });
  }

  async expectMarkerTooltipToBeVisible() {
    await test.step(`Expect marker tooltip to be visible`, async () => {
      await expect(this.markerTooltip).toBeVisible();
    });
  }

  async expectMarkerTooltipToBeClosed() {
    await test.step(`Expect marker tooltip to be closed`, async () => {
      await expect(this.markerTooltip).not.toBeAttached();
    });
  }

  async expectMarkerTooltipHaveValues(
    name: string,
    coordinates: string,
    type: string,
    depth: string,
    visibility: string,
  ) {
    await test.step(`Expect tooltip name is equal: ${name}`, async () => {
      await expect(this.markerTooltipName).toHaveText(name);
    });

    await test.step(`Expect tooltip coordinates contains: ${coordinates}`, async () => {
      await expect(this.markerTooltipCoordinates).toContainText(coordinates);
    });

    await test.step(`Expect tooltip type contains: ${type}`, async () => {
      await expect(this.markerTooltipType).toContainText(type);
    });

    await test.step(`Expect tooltip depth is equal: ${depth}`, async () => {
      await expect(this.markerTooltipDepth).toContainText(depth);
    });

    await test.step(`Expect tooltip visibility is equal: ${visibility}`, async () => {
      await expect(this.markerTooltipVisibility).toContainText(visibility);
    });
  }

  async clickOnCluster() {
    await test.step(`Click on cluster`, async () => {
      await this.cluster.first().click();
    });
  }

  async getClustersCount() {
    const clusterCount = await this.cluster.count();
    await test.step(`${clusterCount} clusters are displayed`, () => {});
    return clusterCount;
  }

  async assertThatClustersCountIsEqual(expectedCount: number) {
    await test.step(`The number of markers displayed is: ${expectedCount}`, async () => {
      const currentCount = await this.getClustersCount();
      expect(currentCount).toEqual(expectedCount);
    });
  }

  async assertThatClustersCountLessThan(expectedCount: number) {
    await test.step(`The number of clusters less than: ${expectedCount}`, async () => {
      const currentCount = await this.getClustersCount();
      expect(currentCount).toBeLessThan(expectedCount);
    });
  }

  async expectButtonReadMoreToBeVisible() {
    await test.step(`Expect button read more to be visible`, async () => {
      await expect(this.buttonReadMore).toBeVisible();
    });
  }
}
