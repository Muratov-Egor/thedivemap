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
    // Desktop локаторы
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

  // Приватные методы для получения локаторов в зависимости от контекста
  private getInputLocator(isMobile: boolean = false): Locator {
    if (isMobile) {
      return this.page.getByTestId('mobile-filters-panel').getByTestId('autocomplete-input');
    }
    return this.autocompleteInput;
  }

  private getListLocator(isMobile: boolean = false): Locator {
    if (isMobile) {
      return this.page.getByTestId('mobile-filters-panel').getByTestId('autocomplete-list');
    }
    return this.autocompleteList;
  }

  private getItemLocator(isMobile: boolean = false): Locator {
    if (isMobile) {
      return this.page.getByTestId('mobile-filters-panel').getByTestId('autocomplete-item');
    }
    return this.autocompleteItem;
  }

  private getClearButtonLocator(isMobile: boolean = false): Locator {
    if (isMobile) {
      return this.page.getByTestId('mobile-filters-panel').getByTestId('autocomplete-clear-button');
    }
    return this.autocompleteClearButton;
  }

  private getSearchIconLocator(isMobile: boolean = false): Locator {
    if (isMobile) {
      return this.page.getByTestId('mobile-filters-panel').locator('[data-testid="autocomplete-input"] + div svg');
    }
    return this.autocompleteSearchIcon;
  }

  private getResultsCountLocator(isMobile: boolean = false): Locator {
    if (isMobile) {
      return this.page.getByTestId('mobile-filters-panel').getByTestId('autocomplete-list-results-count');
    }
    return this.autocompleteListResultsCount;
  }

  async typeText(text: string, isMobile: boolean = false) {
    await test.step(`Enter text into ${isMobile ? 'mobile ' : ''}autocomplete field`, async () => {
      await this.getInputLocator(isMobile).pressSequentially(text, { delay: 100 });
    });
  }

  async expectListToBeLoading(isMobile: boolean = false) {
    await test.step(`Expect ${isMobile ? 'mobile ' : ''}autocomplete list to be in loading state`, async () => {
      // Проверяем, что список видим (это означает, что загрузка началась)
      await expect(this.getListLocator(isMobile)).toBeVisible();
    });
  }

  async expectListNotToBeLoading() {
    await test.step(`Expect autocomplete list to be not in loading state`, async () => {
      await expect(this.autocompleteListLoading).toBeHidden();
    });
  }

  async expectListToBeVisible(isMobile: boolean = false) {
    await test.step(`Expect ${isMobile ? 'mobile ' : ''}autocomplete results list to be visible`, async () => {
      await expect(this.getListLocator(isMobile)).toBeVisible();
    });
  }

  async expectListToBeHidden(isMobile: boolean = false) {
    await test.step(`Expect ${isMobile ? 'mobile ' : ''}autocomplete results list to be hidden`, async () => {
      await expect(this.getListLocator(isMobile)).toBeHidden();
    });
  }

  async expectResultsCount(count: number, isMobile: boolean = false) {
    await test.step(`Expect ${isMobile ? 'mobile ' : ''}autocomplete to show ${count} results`, async () => {
      await expect(this.getResultsCountLocator(isMobile)).toContainText(`${count}`);
    });
  }

  async clickClearButton(isMobile: boolean = false) {
    await test.step(`Click ${isMobile ? 'mobile ' : ''}clear button`, async () => {
      await this.getClearButtonLocator(isMobile).click();
    });
  }

  async expectInputToBeEmpty(isMobile: boolean = false) {
    await test.step(`Expect ${isMobile ? 'mobile ' : ''}input to be empty`, async () => {
      await expect(this.getInputLocator(isMobile)).toHaveValue('');
    });
  }

  async expectInputToHaveValue(value: string, isMobile: boolean = false) {
    await test.step(`Expect ${isMobile ? 'mobile ' : ''}input to have value: ${value}`, async () => {
      await expect(this.getInputLocator(isMobile)).toHaveValue(value);
    });
  }

  async clickOnFirstResult(isMobile: boolean = false) {
    await test.step(`Click on first ${isMobile ? 'mobile ' : ''}result`, async () => {
      await this.getItemLocator(isMobile).first().click();
    });
  }

  async pressKey(key: string, isMobile: boolean = false) {
    await test.step(`Press key on ${isMobile ? 'mobile ' : ''}: ${key}`, async () => {
      await this.getInputLocator(isMobile).press(key);
    });
  }

  async expectItemNumberToBeSelected(index: number, isMobile: boolean = false) {
    await test.step(`Expect ${isMobile ? 'mobile ' : ''}item at index ${index} to be selected`, async () => {
      // Проверяем, что autocompleteItem с указанным индексом имеет CSS класс для выделения
      const selectedItem = this.getItemLocator(isMobile).nth(index);
      await expect(selectedItem).toHaveClass(/from-tropical-blue\/10/);
    });
  }

  async expectResultTypeToBeVisible(type: string, icon: string, isMobile: boolean = false) {
    await test.step(`Expect ${isMobile ? 'mobile ' : ''}result type ${type} with icon ${icon} to be visible`, async () => {
      const items = this.getItemLocator(isMobile).filter({ hasText: icon });
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

  async expectSearchIconToBeVisible(isMobile: boolean = false) {
    await test.step(`Expect ${isMobile ? 'mobile ' : ''}search icon to be visible`, async () => {
      await expect(this.getSearchIconLocator(isMobile)).toBeVisible();
    });
  }

  async expectSearchIconToBeHidden(isMobile: boolean = false) {
    await test.step(`Expect ${isMobile ? 'mobile ' : ''}search icon to be hidden`, async () => {
      await expect(this.getSearchIconLocator(isMobile)).toBeHidden();
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
