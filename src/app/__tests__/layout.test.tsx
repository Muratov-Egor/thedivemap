import { render } from '@testing-library/react';
import RootLayout from '../layout';

// Мокаем компоненты
jest.mock('../../i18n/I18nProvider', () => {
  return function MockI18nProvider({ children }: { children: React.ReactNode }) {
    return <div data-testid="i18n-provider">{children}</div>;
  };
});

jest.mock('../../i18n/LangAttribute', () => {
  return function MockLangAttribute() {
    return <div data-testid="lang-attribute" />;
  };
});

// Мокаем CSS импорты
jest.mock('../globals.css', () => ({}));
jest.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));

describe('RootLayout', () => {
  it('должен рендерить HTML структуру с правильными атрибутами', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>,
    );

    // Проверяем что компоненты рендерятся

    // Проверяем что компоненты рендерятся
    expect(container.querySelector('[data-testid="i18n-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="lang-attribute"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="test-child"]')).toBeInTheDocument();
  });

  it('должен включать I18nProvider', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>,
    );

    expect(getByTestId('i18n-provider')).toBeInTheDocument();
  });

  it('должен включать LangAttribute', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>,
    );

    expect(getByTestId('lang-attribute')).toBeInTheDocument();
  });

  it('должен рендерить children внутри I18nProvider', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>,
    );

    const i18nProvider = getByTestId('i18n-provider');
    const testChild = getByTestId('test-child');

    expect(i18nProvider).toContainElement(testChild);
    expect(testChild).toHaveTextContent('Test Content');
  });

  it('должен иметь правильную структуру компонентов', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>,
    );

    const i18nProvider = container.querySelector('[data-testid="i18n-provider"]');
    const langAttribute = container.querySelector('[data-testid="lang-attribute"]');
    const testChild = container.querySelector('[data-testid="test-child"]');

    expect(i18nProvider).toBeInTheDocument();
    expect(langAttribute).toBeInTheDocument();
    expect(testChild).toBeInTheDocument();
  });

  it('должен экспортировать правильные метаданные', async () => {
    const { metadata } = await import('../layout');

    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('The Dive Map');
    expect(metadata.description).toBe('Мировая карта дайв-сайтов');
  });
});
