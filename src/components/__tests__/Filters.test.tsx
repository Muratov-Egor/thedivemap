import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filters from '../Filters';

// Мокаем react-i18next
const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: (ns: string) => mockUseTranslation(ns),
}));

// Мокаем MapContext
const mockCenterOnSelection = jest.fn();
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

describe('Filters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCenterOnSelection.mockClear();

    mockUseTranslation.mockImplementation((ns) => {
      if (ns === 'filters') {
        return {
          t: (key: string) => {
            const translations: Record<string, string> = {
              title: 'Фильтры',
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
    });
  });

  it('рендерит десктопную панель фильтров', () => {
    render(<Filters />);

    const desktopPanel = screen.getByTestId('desktop-filters-panel');
    const title = screen.getByText('Фильтры');
    const autocomplete = screen.getByTestId('autocomplete');

    expect(desktopPanel).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(autocomplete).toBeInTheDocument();
  });

  it('рендерит кнопку открытия мобильной панели', () => {
    render(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');
    const filtersIcon = screen.getByTestId('filters-icon');

    expect(openButton).toBeInTheDocument();
    expect(filtersIcon).toBeInTheDocument();
    expect(openButton).toHaveAttribute('aria-label', 'Открыть фильтры');
  });

  it('открывает мобильную панель при клике на кнопку', () => {
    render(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');
    fireEvent.click(openButton);

    const mobilePanel = screen.getByTestId('mobile-filters-panel');
    const closeButton = screen.getByTestId('close-filters-panel-button');

    expect(mobilePanel).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it('закрывает мобильную панель при клике на кнопку закрытия', () => {
    render(<Filters />);

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
    render(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');

    // Первый клик - открывает
    fireEvent.click(openButton);
    expect(screen.getByTestId('mobile-filters-panel')).toBeInTheDocument();

    // Второй клик - закрывает
    fireEvent.click(openButton);
    expect(screen.queryByTestId('mobile-filters-panel')).not.toBeInTheDocument();
  });

  it('обрабатывает выбор элемента в автокомплите', async () => {
    render(<Filters />);

    const autocompleteInput = screen.getAllByTestId('autocomplete-input')[0];
    fireEvent.change(autocompleteInput, { target: { value: 'test' } });

    expect(mockCenterOnSelection).toHaveBeenCalledWith({
      id: '1',
      name: 'Test Item',
      type: 'site',
    });
  });

  it('обрабатывает выбор элемента в мобильной панели', async () => {
    render(<Filters />);

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

  it('имеет правильные классы для десктопной панели', () => {
    render(<Filters />);

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
    render(<Filters />);

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
    render(<Filters />);

    const openButton = screen.getByTestId('open-filters-panel-button');
    expect(openButton).toHaveClass('bg-gradient-coral', 'text-white', 'rounded-full');
  });

  it('имеет правильные классы для кнопки закрытия', () => {
    render(<Filters />);

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

    render(<Filters />);

    const autocompleteInputs = screen.getAllByTestId('autocomplete-input');
    expect(autocompleteInputs.length).toBeGreaterThan(0);
  });
});
