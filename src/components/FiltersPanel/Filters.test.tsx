import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filters from '../FiltersPanel/Filters';
import { FiltersProvider } from '@/contexts/FiltersContext';

// Мокаем react-i18next
const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: (ns: string) => mockUseTranslation(ns),
}));

// Мокаем MapContext
const mockCenterOnSelection = jest.fn();
const mockClearFilters = jest.fn();
const mockUseMap = jest.fn();

jest.mock('@/contexts/MapContext', () => ({
  useMap: () => mockUseMap(),
}));

// Мокаем useFilters
const mockUseFilters = jest.fn();

jest.mock('@/hooks/useFilters', () => ({
  useFilters: () => mockUseFilters(),
}));

// Мокаем useFiltersPanel
const mockUseFiltersPanel = jest.fn();

jest.mock('@/hooks/useFiltersPanel', () => ({
  useFiltersPanel: () => mockUseFiltersPanel(),
}));

// Мокаем useIsMobile
const mockUseIsMobile = jest.fn();

jest.mock('@/hooks/useMediaQuery', () => ({
  useIsMobile: () => mockUseIsMobile(),
}));

// Мокаем Autocomplete
jest.mock('@/components/ui/Autocomplete/Autocomplete', () => {
  return function MockAutocomplete({ placeholder, onSelect }: any) {
    return (
      <div data-testid="autocomplete">
        <input
          placeholder={placeholder}
          data-testid="autocomplete-input"
          onChange={(e) => {
            if (e.target.value === 'test') {
              onSelect({ id: '1', name: 'Test Item', type: 'site' });
            }
          }}
        />
      </div>
    );
  };
});

// Мокаем SiteTypeFilters
jest.mock('@/components/FiltersPanel/SiteTypeFilters/SiteTypeFilters', () => {
  return function MockSiteTypeFilters() {
    return <div data-testid="site-type-filters">Site Type Filters</div>;
  };
});

// Мокаем DifficultyFilters
jest.mock('@/components/FiltersPanel/DifficultyFilters/DifficultyFilters', () => {
  return function MockDifficultyFilters() {
    return <div data-testid="difficulty-filters">Difficulty Filters</div>;
  };
});

// Мокаем RatingFilters
jest.mock('@/components/FiltersPanel/RatingFilters/RatingFilters', () => {
  return function MockRatingFilters() {
    return <div data-testid="rating-filters">Rating Filters</div>;
  };
});

// Мокаем Slider
jest.mock('@/components/ui/Slider', () => {
  return function MockSlider({ label }: any) {
    return <div data-testid="slider">{label}</div>;
  };
});

// Мокаем иконки
jest.mock('@/components/icons', () => ({
  FiltersIcon: () => <div data-testid="filters-icon">Filters</div>,
  CloseIcon: () => <div data-testid="close-icon">Close</div>,
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(<FiltersProvider>{component}</FiltersProvider>);
};

describe('Filters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCenterOnSelection.mockClear();
    mockClearFilters.mockClear();

    // Мокаем window.innerWidth для десктопной версии
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Устанавливаем мок для useIsMobile (по умолчанию десктоп)
    mockUseIsMobile.mockReturnValue(false);

    mockUseTranslation.mockImplementation((ns) => {
      if (ns === 'filters') {
        return {
          t: (key: string) => {
            const translations: Record<string, string> = {
              title: 'Фильтры',
              clearAll: 'Очистить все',
              'accessibility.openFilters': 'Открыть фильтры',
              'accessibility.closeFilters': 'Закрыть фильтры',
            };
            return translations[key] || key;
          },
          i18n: { language: 'ru' },
        };
      }
      if (ns === 'common') {
        return {
          t: (key: string) => {
            const translations: Record<string, string> = {
              'search.placeholder': 'Поиск...',
            };
            return translations[key] || key;
          },
        };
      }
      return { t: (key: string) => key, i18n: { language: 'ru' } };
    });

    mockUseMap.mockReturnValue({
      centerOnSelection: mockCenterOnSelection,
      clearFilters: mockClearFilters,
      setMaxDepthFilter: jest.fn(),
      setMinVisibilityFilter: jest.fn(),
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
      autocompleteInfoMessage: null,
    });

    // Устанавливаем состояние загруженных фильтров по умолчанию
    mockUseFilters.mockReturnValue({
      filters: {
        site_types: [
          { id: 1, label: 'Риф' },
          { id: 2, label: 'Затонувшее судно' },
        ],
        difficulties: [
          { id: 1, label: 'Легкий' },
          { id: 2, label: 'Средний' },
        ],
      },
      loading: false,
      error: null,
    });

    // Устанавливаем мок для useFiltersPanel
    mockUseFiltersPanel.mockReturnValue({
      depthValue: 50,
      setDepthValue: jest.fn(),
      visibilityValue: 0,
      setVisibilityValue: jest.fn(),
      handleAutocompleteSelect: mockCenterOnSelection,
      handleClearAll: mockClearFilters,
      hasActiveFilters: false,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
    });
  });

  it('рендерит десктопную панель фильтров на десктопе', () => {
    renderWithProviders(<Filters />);

    const desktopPanel = screen.getByTestId('desktop-filters-panel');
    const title = screen.getByRole('heading', { level: 2, name: 'Фильтры' });
    const autocomplete = screen.getByTestId('autocomplete');

    expect(desktopPanel).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(autocomplete).toBeInTheDocument();
  });

  it('не рендерит десктопную панель на мобильных устройствах', () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    renderWithProviders(<Filters />);

    expect(screen.queryByTestId('desktop-filters-panel')).not.toBeInTheDocument();
    expect(screen.getByTestId('open-filters-panel-button')).toBeInTheDocument();
  });

  it('показывает лоадер во время загрузки фильтров', () => {
    // Устанавливаем состояние загрузки
    mockUseFilters.mockReturnValue({
      filters: null,
      loading: true,
      error: null,
    });

    renderWithProviders(<Filters />);

    const desktopPanel = screen.getByTestId('desktop-filters-panel');
    const title = screen.getByRole('heading', { level: 2, name: 'Фильтры' });

    expect(desktopPanel).toBeInTheDocument();
    expect(title).toBeInTheDocument();

    // Проверяем, что автокомплит не отображается во время загрузки
    expect(screen.queryByTestId('autocomplete')).not.toBeInTheDocument();

    // Проверяем наличие лоадеров (скелетонов)
    const skeletonElements = screen.getAllByTestId('desktop-filters-panel');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('рендерит кнопку открытия мобильной панели', () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    renderWithProviders(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');
    const filtersIcon = screen.getByTestId('filters-icon');

    expect(openButton).toBeInTheDocument();
    expect(filtersIcon).toBeInTheDocument();
    expect(openButton).toHaveAttribute('aria-label', 'Открыть фильтры');
  });

  it('открывает мобильную панель при клике на кнопку', () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    renderWithProviders(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    const mobilePanel = screen.getByTestId('mobile-filters-panel');
    const closeButton = screen.getByTestId('close-filters-panel-button');

    expect(mobilePanel).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it('закрывает мобильную панель при клике на кнопку закрытия', () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    renderWithProviders(<Filters />);

    // Открываем панель
    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    // Проверяем что панель открылась
    expect(screen.getByTestId('mobile-filters-panel')).toBeInTheDocument();

    // Закрываем панель
    const closeButton = screen.getByTestId('close-filters-panel-button');
    fireEvent.click(closeButton);

    // Проверяем что панель закрылась
    expect(screen.queryByTestId('mobile-filters-panel')).not.toBeInTheDocument();
  });

  it('переключает состояние мобильной панели', () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    renderWithProviders(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');

    // Первый клик - открывает
    fireEvent.click(openButton);
    expect(screen.getByTestId('mobile-filters-panel')).toBeInTheDocument();

    // Второй шаг - закрываем через кнопку закрытия
    const closeButton = screen.getByTestId('close-filters-panel-button');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('mobile-filters-panel')).not.toBeInTheDocument();
  });

  it('обрабатывает выбор элемента в автокомплите', async () => {
    renderWithProviders(<Filters />);

    const autocompleteInput = screen.getAllByTestId('autocomplete-input')[0];
    fireEvent.change(autocompleteInput, { target: { value: 'test' } });

    expect(mockCenterOnSelection).toHaveBeenCalledWith({
      id: '1',
      name: 'Test Item',
      type: 'site',
    });
  });

  it('обрабатывает выбор элемента в мобильной панели', async () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    renderWithProviders(<Filters />);

    // Открываем мобильную панель
    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    // Теперь используется общий компонент, поэтому берем первый автокомплит
    const mobileAutocompleteInput = screen.getByTestId('autocomplete-input');
    fireEvent.change(mobileAutocompleteInput, { target: { value: 'test' } });

    expect(mockCenterOnSelection).toHaveBeenCalledWith({
      id: '1',
      name: 'Test Item',
      type: 'site',
    });
  });

  it('не показывает кнопку очистки когда нет активных фильтров', () => {
    // Мокаем пустые фильтры без дефолтных значений слайдеров
    mockUseFiltersPanel.mockReturnValue({
      depthValue: 50,
      setDepthValue: jest.fn(),
      visibilityValue: 0,
      setVisibilityValue: jest.fn(),
      handleAutocompleteSelect: mockCenterOnSelection,
      handleClearAll: mockClearFilters,
      hasActiveFilters: false,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
        minRating: null,
      },
    });

    renderWithProviders(<Filters />);

    expect(screen.queryByTestId('clear-all-filters-button')).not.toBeInTheDocument();
  });

  it('показывает кнопку очистки когда есть активные фильтры типа сайта', () => {
    mockUseFiltersPanel.mockReturnValue({
      depthValue: 50,
      setDepthValue: jest.fn(),
      visibilityValue: 0,
      setVisibilityValue: jest.fn(),
      handleAutocompleteSelect: mockCenterOnSelection,
      handleClearAll: mockClearFilters,
      hasActiveFilters: true,
      activeFilters: {
        siteTypeIds: [1],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
    });

    renderWithProviders(<Filters />);

    expect(screen.getByTestId('clear-all-filters-button')).toBeInTheDocument();
    expect(screen.getByText('Очистить все')).toBeInTheDocument();
  });

  it('показывает кнопку очистки когда есть активные фильтры сложности', () => {
    mockUseFiltersPanel.mockReturnValue({
      depthValue: 50,
      setDepthValue: jest.fn(),
      visibilityValue: 0,
      setVisibilityValue: jest.fn(),
      handleAutocompleteSelect: mockCenterOnSelection,
      handleClearAll: mockClearFilters,
      hasActiveFilters: true,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [2],
        maxDepth: null,
        minVisibility: null,
      },
    });

    renderWithProviders(<Filters />);

    expect(screen.getByTestId('clear-all-filters-button')).toBeInTheDocument();
    expect(screen.getByText('Очистить все')).toBeInTheDocument();
  });

  it('вызывает clearFilters при клике на кнопку очистки в десктопной версии', () => {
    mockUseFiltersPanel.mockReturnValue({
      depthValue: 50,
      setDepthValue: jest.fn(),
      visibilityValue: 0,
      setVisibilityValue: jest.fn(),
      handleAutocompleteSelect: mockCenterOnSelection,
      handleClearAll: mockClearFilters,
      hasActiveFilters: true,
      activeFilters: {
        siteTypeIds: [1],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
    });

    renderWithProviders(<Filters />);

    const clearButton = screen.getByTestId('clear-all-filters-button');
    fireEvent.click(clearButton);

    expect(mockClearFilters).toHaveBeenCalledTimes(1);
  });

  it('вызывает clearFilters при клике на кнопку очистки в мобильной версии', () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    mockUseFiltersPanel.mockReturnValue({
      depthValue: 50,
      setDepthValue: jest.fn(),
      visibilityValue: 0,
      setVisibilityValue: jest.fn(),
      handleAutocompleteSelect: mockCenterOnSelection,
      handleClearAll: mockClearFilters,
      hasActiveFilters: true,
      activeFilters: {
        siteTypeIds: [1],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
    });

    renderWithProviders(<Filters />);

    // Открываем мобильную панель
    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    const clearButton = screen.getByTestId('clear-all-filters-button');
    fireEvent.click(clearButton);

    expect(mockClearFilters).toHaveBeenCalledTimes(1);
  });

  it('имеет правильные классы для десктопной панели', () => {
    renderWithProviders(<Filters />);

    const desktopPanel = screen.getByTestId('desktop-filters-panel');
    expect(desktopPanel).toHaveClass(
      'flex',
      'flex-col',
      'justify-start',
      'items-center',
      'w-[600px]',
      'border-l',
      'border-gray-200',
      'p-6',
      'overflow-y-auto',
      'h-full',
      'max-h-[calc(100vh-4rem)]',
      'sm:max-h-full',
    );
  });

  it('имеет правильные классы для мобильной панели', () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    renderWithProviders(<Filters />);

    // Открываем мобильную панель
    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    const mobilePanel = screen.getByTestId('mobile-filters-panel');
    expect(mobilePanel).toHaveClass(
      'fixed',
      'inset-0',
      'bg-background',
      'shadow-lg',
      'z-50',
      'flex',
      'flex-col',
    );
  });

  it('имеет правильные классы для кнопки открытия', () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    renderWithProviders(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');
    expect(openButton).toHaveClass('bg-pastel-turquoise', 'text-outline-purple', 'rounded-full');
  });

  it('имеет правильные классы для кнопки закрытия', () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    renderWithProviders(<Filters />);

    // Открываем мобильную панель
    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    const closeButton = screen.getByTestId('close-filters-panel-button');
    expect(closeButton).toHaveClass('rounded-full');
  });

  it('передает правильный язык в автокомплит', () => {
    mockUseTranslation.mockImplementation((ns) => {
      if (ns === 'filters') {
        return {
          t: (key: string) => key,
          i18n: { language: 'en' },
        };
      }
      if (ns === 'common') {
        return {
          t: (key: string) => key,
        };
      }
      return { t: (key: string) => key, i18n: { language: 'en' } };
    });

    renderWithProviders(<Filters />);

    const autocompleteInputs = screen.getAllByTestId('autocomplete-input');
    expect(autocompleteInputs.length).toBeGreaterThan(0);
  });
});
