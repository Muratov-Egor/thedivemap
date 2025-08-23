import { render } from '@testing-library/react';
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

jest.mock('../../contexts/MapContext', () => ({
  MapProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-provider">{children}</div>
  ),
}));

describe('HomePage', () => {
  it('должен рендерить главную страницу с правильной структурой', () => {
    const { container } = render(<HomePage />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('h-full', 'w-full', 'flex', 'flex-col');
  });

  it('должен включать Header компонент', () => {
    const { getByTestId } = render(<HomePage />);

    expect(getByTestId('header')).toBeInTheDocument();
  });

  it('должен включать MapProvider', () => {
    const { getByTestId } = render(<HomePage />);

    expect(getByTestId('map-provider')).toBeInTheDocument();
  });

  it('должен включать MapContainer внутри MapProvider', () => {
    const { getByTestId } = render(<HomePage />);

    const mapProvider = getByTestId('map-provider');
    const mapContainer = getByTestId('map-container');

    expect(mapProvider).toContainElement(mapContainer);
  });

  it('должен включать Filters внутри MapProvider', () => {
    const { getByTestId } = render(<HomePage />);

    const mapProvider = getByTestId('map-provider');
    const filters = getByTestId('filters');

    expect(mapProvider).toContainElement(filters);
  });

  it('должен иметь правильную структуру flex контейнера', () => {
    const { container } = render(<HomePage />);

    const main = container.querySelector('main');
    const flexContainer = main?.querySelector('.flex-1.flex');

    expect(flexContainer).toBeInTheDocument();
    expect(flexContainer).toHaveClass('flex-1', 'flex');
  });

  it('должен содержать MapContainer и Filters в flex контейнере', () => {
    const { getByTestId, container } = render(<HomePage />);

    const flexContainer = container.querySelector('.flex-1.flex');
    const mapContainer = getByTestId('map-container');
    const filters = getByTestId('filters');

    expect(flexContainer).toContainElement(mapContainer);
    expect(flexContainer).toContainElement(filters);
  });

  it('должен рендерить все компоненты в правильном порядке', () => {
    const { container } = render(<HomePage />);

    const main = container.querySelector('main');
    const header = container.querySelector('[data-testid="header"]');
    const mapProvider = container.querySelector('[data-testid="map-provider"]');
    const flexContainer = container.querySelector('.flex-1.flex');
    const mapContainer = container.querySelector('[data-testid="map-container"]');
    const filters = container.querySelector('[data-testid="filters"]');

    // Проверяем порядок элементов
    expect(main?.children[0]).toBe(header);
    expect(main?.children[1]).toBe(mapProvider);
    expect(mapProvider?.children[0]).toBe(flexContainer);
    expect(flexContainer?.children[0]).toBe(mapContainer);
    expect(flexContainer?.children[1]).toBe(filters);
  });

  it('должен иметь правильные CSS классы для layout', () => {
    const { container } = render(<HomePage />);

    const main = container.querySelector('main');
    const flexContainer = container.querySelector('.flex-1.flex');

    expect(main).toHaveClass('h-full', 'w-full', 'flex', 'flex-col');
    expect(flexContainer).toHaveClass('flex-1', 'flex');
  });
});
