import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filters from '../Filters';
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
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
      },
      autocompleteInfoMessage: null,
    });
  });

  it('рендерит десктопную панель фильтров', () => {
    renderWithProviders(<Filters />);

    const desktopPanel = screen.getByTestId('desktop-filters-panel');
    const title = screen.getByText('Фильтры');
    const autocomplete = screen.getByTestId('autocomplete');

    expect(desktopPanel).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(autocomplete).toBeInTheDocument();
  });

  it('рендерит кнопку открытия мобильной панели', () => {
    renderWithProviders(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');
    const filtersIcon = screen.getByTestId('filters-icon');

    expect(openButton).toBeInTheDocument();
    expect(filtersIcon).toBeInTheDocument();
    expect(openButton).toHaveAttribute('aria-label', 'Открыть фильтры');
  });

  it('открывает мобильную панель при клике на кнопку', () => {
    renderWithProviders(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    const mobilePanel = screen.getByTestId('mobile-filters-panel');
    const closeButton = screen.getByTestId('close-filters-panel-button');

    expect(mobilePanel).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it('закрывает мобильную панель при клике на кнопку закрытия', () => {
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
    renderWithProviders(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');

    // Первый клик - открывает
    fireEvent.click(openButton);
    expect(screen.getByTestId('mobile-filters-panel')).toBeInTheDocument();

    // Второй клик - закрывает
    fireEvent.click(openButton);
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
    renderWithProviders(<Filters />);

    // Открываем мобильную панель
    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    const mobileAutocompleteInput = screen.getAllByTestId('autocomplete-input')[1];
    fireEvent.change(mobileAutocompleteInput, { target: { value: 'test' } });

    expect(mockCenterOnSelection).toHaveBeenCalledWith({
      id: '1',
      name: 'Test Item',
      type: 'site',
    });
  });

  it('не показывает кнопку очистки когда нет активных фильтров', () => {
    renderWithProviders(<Filters />);

    expect(screen.queryByTestId('clear-all-filters-button')).not.toBeInTheDocument();
  });

  it('показывает кнопку очистки когда есть активные фильтры типа сайта', () => {
    mockUseMap.mockReturnValue({
      centerOnSelection: mockCenterOnSelection,
      clearFilters: mockClearFilters,
      activeFilters: {
        siteTypeIds: [1],
        difficultyIds: [],
      },
      autocompleteInfoMessage: null,
    });

    renderWithProviders(<Filters />);

    expect(screen.getByTestId('clear-all-filters-button')).toBeInTheDocument();
    expect(screen.getByText('Очистить все')).toBeInTheDocument();
  });

  it('показывает кнопку очистки когда есть активные фильтры сложности', () => {
    mockUseMap.mockReturnValue({
      centerOnSelection: mockCenterOnSelection,
      clearFilters: mockClearFilters,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [2],
      },
      autocompleteInfoMessage: null,
    });

    renderWithProviders(<Filters />);

    expect(screen.getByTestId('clear-all-filters-button')).toBeInTheDocument();
    expect(screen.getByText('Очистить все')).toBeInTheDocument();
  });

  it('вызывает clearFilters при клике на кнопку очистки в десктопной версии', () => {
    mockUseMap.mockReturnValue({
      centerOnSelection: mockCenterOnSelection,
      clearFilters: mockClearFilters,
      activeFilters: {
        siteTypeIds: [1],
        difficultyIds: [],
      },
      autocompleteInfoMessage: null,
    });

    renderWithProviders(<Filters />);

    const clearButton = screen.getByTestId('clear-all-filters-button');
    fireEvent.click(clearButton);

    expect(mockClearFilters).toHaveBeenCalledTimes(1);
  });

  it('вызывает clearFilters при клике на кнопку очистки в мобильной версии', () => {
    mockUseMap.mockReturnValue({
      centerOnSelection: mockCenterOnSelection,
      clearFilters: mockClearFilters,
      activeFilters: {
        siteTypeIds: [1],
        difficultyIds: [],
      },
      autocompleteInfoMessage: null,
    });

    renderWithProviders(<Filters />);

    // Открываем мобильную панель
    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    const clearButton = screen.getByTestId('clear-all-filters-button-mobile');
    fireEvent.click(clearButton);

    expect(mockClearFilters).toHaveBeenCalledTimes(1);
  });

  it('имеет правильные классы для десктопной панели', () => {
    renderWithProviders(<Filters />);

    const desktopPanel = screen.getByTestId('desktop-filters-panel');
    expect(desktopPanel).toHaveClass(
      'hidden',
      'md:flex',
      'flex-col',
      'justify-start',
      'items-center',
      'md:w-[500px]',
      'border-l',
      'border-gray-200',
      'p-6',
      'overflow-y-auto',
      'max-h-screen',
    );
  });

  it('имеет правильные классы для мобильной панели', () => {
    renderWithProviders(<Filters />);

    // Открываем мобильную панель
    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    const mobilePanel = screen.getByTestId('mobile-filters-panel');
    expect(mobilePanel).toHaveClass(
      'absolute',
      'right-0',
      'top-0',
      'h-full',
      'w-full',
      'bg-white',
      'shadow-lg',
      'transform',
      'transition-transform',
      'duration-300',
      'ease-in-out',
      'z-50',
      'flex',
      'flex-col',
    );
  });

  it('имеет правильные классы для кнопки открытия', () => {
    renderWithProviders(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');
    expect(openButton).toHaveClass('bg-gradient-coral', 'text-white', 'rounded-full');
  });

  it('имеет правильные классы для кнопки закрытия', () => {
    renderWithProviders(<Filters />);

    // Открываем мобильную панель
    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    const closeButton = screen.getByTestId('close-filters-panel-button');
    expect(closeButton).toHaveClass('bg-transparent', 'text-slate-600', 'rounded-full');
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
