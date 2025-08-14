import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AutocompleteList from '../AutocompleteList';
import { AutocompleteItem } from '../types';

// Мокаем i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        loading: 'Загрузка...',
        'errors.searchFailed': 'Ошибка поиска',
        resultsLabel: 'Результаты поиска',
        resultsCount: 'Найдено результатов',
      };
      return translations[key] || key;
    },
  }),
}));

// Мокаем utils
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

// Мокаем AutocompleteItem
jest.mock('../AutocompleteItem', () => {
  return function MockAutocompleteItem({
    item,
    isSelected,
    onClick,
    index,
  }: {
    item: { id: number; name: string; type: string };
    isSelected: boolean;
    onClick: () => void;
    index: number;
  }) {
    return (
      <div
        role="option"
        aria-selected={isSelected}
        onClick={onClick}
        data-testid={`autocomplete-item-${index}`}
      >
        {item.name} ({item.type})
      </div>
    );
  };
});

const createTestItems = (count: number = 3): AutocompleteItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Test Item ${i + 1}`,
    type: 'site' as const,
  }));

describe('AutocompleteList Component', () => {
  const defaultProps = {
    results: createTestItems(),
    selectedIndex: 0,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит список результатов с правильными accessibility атрибутами', () => {
    render(<AutocompleteList {...defaultProps} />);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(listbox).toHaveAttribute('aria-label', 'Результаты поиска');
    expect(listbox).toHaveAttribute('id', 'autocomplete-listbox');
  });

  it('отображает все элементы списка', () => {
    render(<AutocompleteList {...defaultProps} />);

    expect(screen.getByTestId('autocomplete-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('autocomplete-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('autocomplete-item-2')).toBeInTheDocument();
  });

  it('передает правильные пропсы в AutocompleteItem', () => {
    const onSelect = jest.fn();
    render(<AutocompleteList {...defaultProps} onSelect={onSelect} selectedIndex={1} />);

    const item1 = screen.getByTestId('autocomplete-item-0');
    const item2 = screen.getByTestId('autocomplete-item-1');

    expect(item1).toHaveAttribute('aria-selected', 'false');
    expect(item2).toHaveAttribute('aria-selected', 'true');
  });

  it('вызывает onSelect при клике на элемент', () => {
    const onSelect = jest.fn();
    render(<AutocompleteList {...defaultProps} onSelect={onSelect} />);

    fireEvent.click(screen.getByTestId('autocomplete-item-1'));
    expect(onSelect).toHaveBeenCalledWith(defaultProps.results[1]);
  });

  it('отображает счетчик результатов', () => {
    render(<AutocompleteList {...defaultProps} />);

    expect(screen.getByTestId('autocomplete-list-results-count')).toHaveTextContent(
      'Найдено результатов: 3',
    );
  });

  it('не рендерит ничего при пустом списке', () => {
    const { container } = render(<AutocompleteList {...defaultProps} results={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('отображает состояние загрузки', () => {
    render(<AutocompleteList {...defaultProps} isLoading={true} />);

    expect(screen.getByTestId('autocomplete-list-loading')).toBeInTheDocument();
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    expect(
      screen.getByTestId('autocomplete-list-loading').querySelector('.animate-spin'),
    ).toBeInTheDocument(); // Спиннер
  });

  it('не отображает результаты при загрузке', () => {
    render(<AutocompleteList {...defaultProps} isLoading={true} />);

    expect(screen.queryByTestId('autocomplete-item-0')).not.toBeInTheDocument();
    expect(screen.queryByTestId('autocomplete-list-results-count')).not.toBeInTheDocument();
  });

  it('отображает ошибку', () => {
    const errorMessage = 'Network error occurred';
    render(<AutocompleteList {...defaultProps} error={errorMessage} />);

    expect(screen.getByTestId('autocomplete-list-error')).toBeInTheDocument();
    expect(screen.getByText('Ошибка поиска')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('не отображает результаты при ошибке', () => {
    render(<AutocompleteList {...defaultProps} error="Test error" />);

    expect(screen.queryByTestId('autocomplete-item-0')).not.toBeInTheDocument();
    expect(screen.queryByTestId('autocomplete-list-results-count')).not.toBeInTheDocument();
  });

  it('приоритизирует загрузку над ошибкой', () => {
    render(<AutocompleteList {...defaultProps} isLoading={true} error="Test error" />);

    expect(screen.getByTestId('autocomplete-list-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('autocomplete-list-error')).not.toBeInTheDocument();
  });

  it('применяет кастомные CSS классы', () => {
    render(<AutocompleteList {...defaultProps} className="custom-list-class" />);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveClass('custom-list-class');
  });

  it('правильно обрабатывает большое количество результатов', () => {
    const manyItems = createTestItems(10);
    render(<AutocompleteList {...defaultProps} results={manyItems} />);

    expect(screen.getByTestId('autocomplete-item-9')).toBeInTheDocument();
    expect(screen.getByTestId('autocomplete-list-results-count')).toHaveTextContent(
      'Найдено результатов: 10',
    );
  });

  it('правильно обрабатывает selectedIndex за пределами списка', () => {
    render(<AutocompleteList {...defaultProps} selectedIndex={5} />);

    // Не должно падать, но selectedIndex должен быть в пределах списка
    expect(screen.getByTestId('autocomplete-item-0')).toBeInTheDocument();
  });

  it('правильно обрабатывает отрицательный selectedIndex', () => {
    render(<AutocompleteList {...defaultProps} selectedIndex={-1} />);

    expect(screen.getByTestId('autocomplete-item-0')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByTestId('autocomplete-item-1')).toHaveAttribute('aria-selected', 'false');
  });

  it('имеет правильную структуру DOM для списка результатов', () => {
    render(<AutocompleteList {...defaultProps} />);

    const listbox = screen.getByRole('listbox');

    // Проверяем структуру
    expect(listbox.querySelector('[data-testid="autocomplete-item-0"]')).toBeInTheDocument();
    expect(
      listbox.querySelector('[data-testid="autocomplete-list-results-count"]'),
    ).toBeInTheDocument();
  });

  it('имеет правильную структуру DOM для состояния загрузки', () => {
    render(<AutocompleteList {...defaultProps} isLoading={true} />);

    const loadingContainer = screen.getByTestId('autocomplete-list-loading');

    expect(loadingContainer.querySelector('.animate-spin')).toBeInTheDocument();
    expect(loadingContainer.querySelector('.text-sm')).toBeInTheDocument();
  });

  it('имеет правильную структуру DOM для ошибки', () => {
    render(<AutocompleteList {...defaultProps} error="Test error" />);

    const errorContainer = screen.getByTestId('autocomplete-list-error');

    expect(errorContainer.querySelector('.text-lg')).toBeInTheDocument(); // Иконка ошибки
    expect(errorContainer.querySelector('.font-medium')).toBeInTheDocument(); // Заголовок ошибки
  });

  it('поддерживает aria-live для счетчика результатов', () => {
    render(<AutocompleteList {...defaultProps} />);

    const resultsCount = screen.getByTestId('autocomplete-list-results-count');
    expect(resultsCount).toHaveAttribute('aria-live', 'polite');
    expect(resultsCount).toHaveAttribute('aria-label', 'Найдено результатов: 3');
  });

  it('правильно обрабатывает разные типы элементов', () => {
    const mixedItems: AutocompleteItem[] = [
      { id: 1, name: 'Site 1', type: 'site' },
      { id: 2, name: 'Country 1', type: 'country' },
      { id: 3, name: 'Region 1', type: 'region' },
      { id: 4, name: 'Location 1', type: 'location' },
    ];

    render(<AutocompleteList {...defaultProps} results={mixedItems} />);

    expect(screen.getByTestId('autocomplete-item-0')).toHaveTextContent('Site 1 (site)');
    expect(screen.getByTestId('autocomplete-item-1')).toHaveTextContent('Country 1 (country)');
    expect(screen.getByTestId('autocomplete-item-2')).toHaveTextContent('Region 1 (region)');
    expect(screen.getByTestId('autocomplete-item-3')).toHaveTextContent('Location 1 (location)');
  });

  it('правильно обрабатывает элементы с метаданными', () => {
    const itemsWithMetadata: AutocompleteItem[] = [
      {
        id: 1,
        name: 'Test Site',
        type: 'site',
        metadata: { site_type: 'Reef' },
      },
    ];

    render(<AutocompleteList {...defaultProps} results={itemsWithMetadata} />);

    expect(screen.getByTestId('autocomplete-item-0')).toBeInTheDocument();
  });

  it('правильно обрабатывает элементы с subtitle', () => {
    const itemsWithSubtitle: AutocompleteItem[] = [
      {
        id: 1,
        name: 'Test Site',
        type: 'site',
        subtitle: 'Test Country',
      },
    ];

    render(<AutocompleteList {...defaultProps} results={itemsWithSubtitle} />);

    expect(screen.getByTestId('autocomplete-item-0')).toBeInTheDocument();
  });
});
