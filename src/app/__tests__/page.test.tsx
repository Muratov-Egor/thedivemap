import { render } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import I18nProvider from '@/i18n/I18nProvider';
import HomePage from '../page';

// Мокаем Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    has: jest.fn(),
  }),
}));

// Мокаем компоненты
jest.mock('../../components/Header/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../../components/map/MapContainer', () => {
  return function MockMapContainer() {
    return <div data-testid="map-container">Map Container</div>;
  };
});

jest.mock('../../components/FiltersPanel/Filters', () => {
  return function MockFilters() {
    return <div data-testid="filters">Filters</div>;
  };
});

jest.mock('../../components/PanelSwitcher', () => {
  return function MockPanelSwitcher() {
    return <div data-testid="panel-switcher">Panel Switcher</div>;
  };
});

jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('../../contexts/MapContext', () => ({
  MapProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-provider">{children}</div>
  ),
}));

jest.mock('../../contexts/PanelContext', () => ({
  PanelProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="panel-provider">{children}</div>
  ),
}));

// Создаем обертку с провайдерами
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <I18nProvider>{component}</I18nProvider>
    </ThemeProvider>,
  );
};

describe('HomePage', () => {
  it('должен рендерить главную страницу с правильной структурой', () => {
    const { container } = renderWithProviders(<HomePage />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('h-full', 'w-full', 'flex', 'flex-col');
  });

  it('должен включать Header компонент', () => {
    const { getByTestId } = renderWithProviders(<HomePage />);

    expect(getByTestId('header')).toBeInTheDocument();
  });

  it('должен включать MapProvider', () => {
    const { getByTestId } = renderWithProviders(<HomePage />);

    expect(getByTestId('map-provider')).toBeInTheDocument();
  });

  it('должен включать PanelProvider', () => {
    const { getByTestId } = renderWithProviders(<HomePage />);

    expect(getByTestId('panel-provider')).toBeInTheDocument();
  });

  it('должен включать MapContainer внутри MapProvider', () => {
    const { getByTestId } = renderWithProviders(<HomePage />);

    const mapProvider = getByTestId('map-provider');
    const mapContainer = getByTestId('map-container');

    expect(mapProvider).toContainElement(mapContainer);
  });

  it('должен включать PanelSwitcher внутри PanelProvider', () => {
    const { getByTestId } = renderWithProviders(<HomePage />);

    const panelProvider = getByTestId('panel-provider');
    const panelSwitcher = getByTestId('panel-switcher');

    expect(panelProvider).toContainElement(panelSwitcher);
  });

  it('должен включать Footer', () => {
    const { getByTestId } = renderWithProviders(<HomePage />);

    expect(getByTestId('footer')).toBeInTheDocument();
  });

  it('должен иметь правильную структуру flex контейнера', () => {
    const { container } = renderWithProviders(<HomePage />);

    const main = container.querySelector('main');
    const flexContainer = main?.querySelector('.flex-1.flex');

    expect(flexContainer).toBeInTheDocument();
    expect(flexContainer).toHaveClass('flex-1', 'flex');
  });

  it('должен содержать MapContainer и PanelSwitcher в flex контейнере', () => {
    const { getByTestId, container } = renderWithProviders(<HomePage />);

    const flexContainer = container.querySelector('.flex-1.flex');
    const mapContainer = getByTestId('map-container');
    const panelSwitcher = getByTestId('panel-switcher');

    expect(flexContainer).toContainElement(mapContainer);
    expect(flexContainer).toContainElement(panelSwitcher);
  });

  it('должен рендерить все компоненты в правильном порядке', () => {
    const { container } = renderWithProviders(<HomePage />);

    const main = container.querySelector('main');
    const header = container.querySelector('[data-testid="header"]');
    const mapProvider = container.querySelector('[data-testid="map-provider"]');
    const panelProvider = container.querySelector('[data-testid="panel-provider"]');
    const flexContainer = container.querySelector('.flex-1.flex');
    const mapContainer = container.querySelector('[data-testid="map-container"]');
    const panelSwitcher = container.querySelector('[data-testid="panel-switcher"]');
    const footer = container.querySelector('[data-testid="footer"]');

    // Проверяем порядок элементов
    expect(main?.children[0]).toBe(header);
    expect(main?.children[1]).toBe(mapProvider);
    expect(main?.children[2]).toBe(footer);
    expect(mapProvider?.children[0]).toBe(panelProvider);
    expect(panelProvider?.children[0]).toBe(flexContainer);
    expect(flexContainer?.children[0]).toBe(mapContainer);
    expect(flexContainer?.children[1]).toBe(panelSwitcher);
  });

  it('должен иметь правильные CSS классы для layout', () => {
    const { container } = renderWithProviders(<HomePage />);

    const main = container.querySelector('main');
    const flexContainer = container.querySelector('.flex-1.flex');

    expect(main).toHaveClass('h-full', 'w-full', 'flex', 'flex-col');
    expect(flexContainer).toHaveClass('flex-1', 'flex');
  });
});
