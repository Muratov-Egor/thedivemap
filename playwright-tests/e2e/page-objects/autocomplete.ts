import { expect, Locator, Page, test } from '@playwright/test';

export class Autocomplete {
  readonly autocompleteContainer: Locator;
  readonly autocompleteInput: Locator;
  readonly autocompleteLoading: Locator;
  readonly autocompleteClearButton: Locator;
  readonly autocompleteList: Locator;
  readonly autocompleteListLoading: Locator;
  readonly autocompleteListError: Locator;
  readonly autocompleteErrorMessage: Locator;
  readonly autocompleteItem: Locator;
  readonly autocompleteItemName: Locator;
  readonly autocompleteItemType: Locator;
  readonly autocompleteItemSelected: Locator;
  readonly autocompleteListResultsCount: Locator;
  readonly autocompleteSearchIcon: Locator;

  constructor(private page: Page) {
    this.autocompleteContainer = page.getByTestId('autocomplete-container');
    this.autocompleteInput = page.getByTestId('autocomplete-input');
    this.autocompleteLoading = page.getByTestId('autocomplete-loading');
    this.autocompleteClearButton = page.getByTestId('autocomplete-clear-button');
    this.autocompleteList = page.getByTestId('autocomplete-list');
    this.autocompleteListLoading = page.getByTestId('autocomplete-list-loading');
    this.autocompleteListError = page.getByTestId('autocomplete-list-error');
    this.autocompleteErrorMessage = page.getByTestId('autocomplete-error-message');
    this.autocompleteItem = page.getByTestId('autocomplete-item');
    this.autocompleteItemName = page.getByTestId('autocomplete-item-name');
    this.autocompleteItemType = page.getByTestId('autocomplete-item-type');
    this.autocompleteItemSelected = page.getByTestId('autocomplete-item-selected');
    this.autocompleteListResultsCount = page.getByTestId('autocomplete-list-results-count');
    this.autocompleteSearchIcon = page.locator('[data-testid="autocomplete-input"] + div svg');
  }

  async typeText(text: string) {
    await test.step(`Enter text into autocomplete field`, async () => {
      await this.autocompleteInput.pressSequentially(text, { delay: 100 });
    });
  }

  async expectListToBeLoading() {
    await test.step(`Expect autocomplete list to be in loading state`, async () => {
      await expect(this.autocompleteListLoading).toBeVisible();
    });
  }

  async expectListNotToBeLoading() {
    await test.step(`Expect autocomplete list to be not in loading state`, async () => {
      await expect(this.autocompleteListLoading).toBeHidden();
    });
  }

  async expectListToBeVisible() {
    await test.step(`Expect autocomplete results list to be visible`, async () => {
      await expect(this.autocompleteList).toBeVisible();
    });
  }

  async expectListToBeHidden() {
    await test.step(`Expect autocomplete results list to be hidden`, async () => {
      await expect(this.autocompleteList).toBeHidden();
    });
  }

  async expectResultsCount(count: number) {
    await test.step(`Expect autocomplete to show ${count} results`, async () => {
      await expect(this.autocompleteListResultsCount).toContainText(`${count}`);
    });
  }

  async clickClearButton() {
    await test.step('Click clear button', async () => {
      await this.autocompleteClearButton.click();
    });
  }

  async expectInputToBeEmpty() {
    await test.step('Expect input to be empty', async () => {
      await expect(this.autocompleteInput).toHaveValue('');
    });
  }

  async expectInputToHaveValue(value: string) {
    await test.step(`Expect input to have value: ${value}`, async () => {
      await expect(this.autocompleteInput).toHaveValue(value);
    });
  }

  async clickOnFirstResult() {
    await test.step('Click on first result', async () => {
      await this.autocompleteItem.first().click();
    });
  }

  async pressKey(key: string) {
    await test.step(`Press key: ${key}`, async () => {
      await this.autocompleteInput.press(key);
    });
  }

  async expectItemNumberToBeSelected(index: number) {
    await test.step(`Expect item at index ${index} to be selected`, async () => {
      // Проверяем, что autocompleteItem с указанным индексом имеет CSS класс для выделения
      const selectedItem = this.autocompleteItem.nth(index);
      await expect(selectedItem).toHaveClass(/from-tropical-blue\/10/);
    });
  }

  async expectResultTypeToBeVisible(type: string, icon: string) {
    await test.step(`Expect result type ${type} with icon ${icon} to be visible`, async () => {
      const items = this.autocompleteItem.filter({ hasText: icon });
      await expect(items.first()).toBeVisible();
    });
  }

  async blurInput() {
    await test.step('Blur input field', async () => {
      await this.autocompleteInput.blur();
    });
  }

  async focusInput() {
    await test.step('Focus input field', async () => {
      await this.autocompleteInput.focus();
    });
  }

  async expectSearchIconToBeVisible() {
    await test.step('Expect search icon to be visible', async () => {
      await expect(this.autocompleteSearchIcon).toBeVisible();
    });
  }

  async expectSearchIconToBeHidden() {
    await test.step('Expect search icon to be hidden', async () => {
      await expect(this.autocompleteSearchIcon).toBeHidden();
    });
  }

  async expectClearButtonToBeVisible() {
    await test.step('Expect clear button to be visible', async () => {
      await expect(this.autocompleteClearButton).toBeVisible();
    });
  }

  async expectClearButtonToBeHidden() {
    await test.step('Expect clear button to be hidden', async () => {
      await expect(this.autocompleteClearButton).toBeHidden();
    });
  }

  async expectErrorToBeVisible(errorMessage: string) {
    await test.step(`Expect error message to be visible: ${errorMessage}`, async () => {
      // Проверяем простое сообщение об ошибке (когда список закрыт)
      await expect(this.autocompleteErrorMessage).toBeVisible();
      // Проверяем текст ошибки
      await expect(this.autocompleteErrorMessage).toContainText(errorMessage);
    });
  }
}
