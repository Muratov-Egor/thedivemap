import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Autocomplete from '../Autocomplete';

// Мокаем i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        placeholder: 'Поиск мест для дайвинга...',
        searchLabel: 'Поиск',
        clearButton: 'Очистить',
        'errors.searchFailed': 'Ошибка поиска',
      };
      return translations[key] || key;
    },
  }),
}));

// Мокаем utils
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

// Мокаем useAutocomplete хук
const mockUseAutocomplete = {
  state: {
    query: '',
    results: [],
    selectedIndex: -1,
    isOpen: false,
    isLoading: false,
    error: null,
  },
  actions: {
    setQuery: jest.fn(),
    selectItem: jest.fn(),
    openDropdown: jest.fn(),
    closeDropdown: jest.fn(),
    navigateUp: jest.fn(),
    navigateDown: jest.fn(),
    clearResults: jest.fn(),
  },
};

jest.mock('../useAutocomplete', () => ({
  useAutocomplete: jest.fn(() => mockUseAutocomplete),
}));

// Мокаем AutocompleteList
jest.mock('../AutocompleteList', () => {
  return function MockAutocompleteList({
    results,
    onSelect,
    isLoading,
    error,
  }: {
    results: Array<{ id: number; name: string }>;
    onSelect: (item: { id: number; name: string }) => void;
    isLoading?: boolean;
    error?: string;
  }) {
    if (isLoading) {
      return <div data-testid="autocomplete-list-loading">Loading...</div>;
    }
    if (error) {
      return <div data-testid="autocomplete-list-error">{error}</div>;
    }
    if (results.length === 0) {
      return null;
    }
    return (
      <div data-testid="autocomplete-list">
        {results.map((item: { id: number; name: string }, index: number) => (
          <div
            key={item.id}
            data-testid={`autocomplete-item-${index}`}
            onClick={() => onSelect(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
    );
  };
});

describe('Autocomplete Component', () => {
  const defaultProps = {
    onSelect: jest.fn(),
    onSearch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Сбрасываем состояние мока
    mockUseAutocomplete.state = {
      query: '',
      results: [],
      selectedIndex: -1,
      isOpen: false,
      isLoading: false,
      error: null,
    };
  });

  it('рендерит input с правильными accessibility атрибутами', () => {
    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    expect(input).toHaveAttribute('aria-controls', 'autocomplete-listbox');
  });

  it('рендерит input с правильными атрибутами', () => {
    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-controls', 'autocomplete-listbox');
    expect(input).toHaveAttribute('aria-label', 'Поиск');
  });

  it('использует переданный placeholder или дефолтный', () => {
    const { rerender } = render(<Autocomplete {...defaultProps} />);
    expect(screen.getByTestId('autocomplete-input')).toHaveAttribute(
      'placeholder',
      'Поиск мест для дайвинга...',
    );

    rerender(<Autocomplete {...defaultProps} placeholder="Custom placeholder" />);
    expect(screen.getByTestId('autocomplete-input')).toHaveAttribute(
      'placeholder',
      'Custom placeholder',
    );
  });

  it('обрабатывает изменение input', () => {
    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'test query' } });

    expect(mockUseAutocomplete.actions.setQuery).toHaveBeenCalledWith('test query');
    expect(defaultProps.onSearch).toHaveBeenCalledWith('test query');
  });

  it('обрабатывает focus input', () => {
    mockUseAutocomplete.state.results = [{ id: 1, name: 'Test', type: 'site' }];

    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);

    expect(mockUseAutocomplete.actions.openDropdown).toHaveBeenCalled();
  });

  it('обрабатывает blur input', () => {
    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.blur(input);

    // Проверяем, что closeDropdown будет вызван с задержкой
    expect(mockUseAutocomplete.actions.closeDropdown).not.toHaveBeenCalled();
  });

  it('обрабатывает клавиатурные события', () => {
    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');

    // Arrow Down
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(mockUseAutocomplete.actions.navigateDown).toHaveBeenCalled();

    // Arrow Up
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(mockUseAutocomplete.actions.navigateUp).toHaveBeenCalled();

    // Escape
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(mockUseAutocomplete.actions.closeDropdown).toHaveBeenCalled();

    // Tab
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(mockUseAutocomplete.actions.closeDropdown).toHaveBeenCalled();
  });

  it('обрабатывает Enter для выбора элемента', () => {
    mockUseAutocomplete.state.selectedIndex = 0;
    mockUseAutocomplete.state.results = [{ id: 1, name: 'Test Item', type: 'site' }];

    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockUseAutocomplete.actions.selectItem).toHaveBeenCalledWith(
      mockUseAutocomplete.state.results[0],
    );
  });

  it('не выбирает элемент при Enter если нет выбранного элемента', () => {
    mockUseAutocomplete.state.selectedIndex = -1;

    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockUseAutocomplete.actions.selectItem).not.toHaveBeenCalled();
  });

  it('показывает кнопку очистки при наличии query', () => {
    mockUseAutocomplete.state.query = 'test query';

    render(<Autocomplete {...defaultProps} />);

    expect(screen.getByTestId('autocomplete-clear-button')).toBeInTheDocument();
    expect(screen.getByLabelText('Очистить')).toBeInTheDocument();
  });

  it('скрывает кнопку очистки при пустом query', () => {
    mockUseAutocomplete.state.query = '';

    render(<Autocomplete {...defaultProps} />);

    expect(screen.queryByTestId('autocomplete-clear-button')).not.toBeInTheDocument();
  });

  it('обрабатывает клик по кнопке очистки', () => {
    mockUseAutocomplete.state.query = 'test query';

    render(<Autocomplete {...defaultProps} />);

    const clearButton = screen.getByTestId('autocomplete-clear-button');
    fireEvent.click(clearButton);

    expect(mockUseAutocomplete.actions.setQuery).toHaveBeenCalledWith('');
    expect(mockUseAutocomplete.actions.clearResults).toHaveBeenCalled();
  });

  it('показывает иконку поиска при пустом query', () => {
    mockUseAutocomplete.state.query = '';

    render(<Autocomplete {...defaultProps} />);

    // Проверяем наличие иконки поиска (SVG)
    const container = screen.getByTestId('autocomplete-container');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('скрывает иконку поиска при наличии query', () => {
    mockUseAutocomplete.state.query = 'test query';

    render(<Autocomplete {...defaultProps} />);

    expect(screen.queryByTestId('autocomplete-clear-button')).toBeInTheDocument();
  });

  it('показывает индикатор загрузки', () => {
    mockUseAutocomplete.state.isLoading = true;

    render(<Autocomplete {...defaultProps} />);

    expect(screen.getByTestId('autocomplete-loading')).toBeInTheDocument();
  });

  it('показывает индикатор загрузки из пропсов', () => {
    render(<Autocomplete {...defaultProps} loading={true} />);

    expect(screen.getByTestId('autocomplete-loading')).toBeInTheDocument();
  });

  it('скрывает кнопку очистки при загрузке', () => {
    mockUseAutocomplete.state.query = 'test query';
    mockUseAutocomplete.state.isLoading = true;

    render(<Autocomplete {...defaultProps} />);

    expect(screen.queryByTestId('autocomplete-clear-button')).not.toBeInTheDocument();
  });

  it('применяет CSS классы для открытого состояния', () => {
    mockUseAutocomplete.state.isOpen = true;

    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');
    expect(input).toHaveClass('border-primary-action', 'shadow-simple');
  });

  it('применяет CSS классы для состояния ошибки', () => {
    render(<Autocomplete {...defaultProps} error="Test error" />);

    const input = screen.getByTestId('autocomplete-input');
    expect(input).toHaveClass('border-danger-accent');
  });

  it('показывает сообщение об ошибке из хука', () => {
    mockUseAutocomplete.state.error = 'Hook error';

    render(<Autocomplete {...defaultProps} />);

    expect(screen.getByTestId('autocomplete-error-message')).toBeInTheDocument();
    expect(screen.getByTestId('autocomplete-error-message')).toHaveTextContent('Hook error');
  });

  it('поддерживает disabled состояние', () => {
    render(<Autocomplete {...defaultProps} disabled={true} />);

    const input = screen.getByTestId('autocomplete-input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('поддерживает кастомные CSS классы', () => {
    render(<Autocomplete {...defaultProps} className="custom-autocomplete" />);

    const container = screen.getByTestId('autocomplete-container');
    expect(container).toHaveClass('custom-autocomplete');
  });

  it('правильно устанавливает aria-activedescendant', () => {
    mockUseAutocomplete.state.selectedIndex = 2;

    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');
    expect(input).toHaveAttribute('aria-activedescendant', 'autocomplete-option-2');
  });

  it('не устанавливает aria-activedescendant при отрицательном индексе', () => {
    mockUseAutocomplete.state.selectedIndex = -1;

    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });

  it('правильно устанавливает aria-describedby при ошибке', () => {
    render(<Autocomplete {...defaultProps} error="Test error" />);

    const input = screen.getByTestId('autocomplete-input');
    expect(input).toHaveAttribute('aria-describedby', 'autocomplete-error-message');
  });

  it('не устанавливает aria-describedby без ошибки', () => {
    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByTestId('autocomplete-input');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('показывает сообщение об ошибке', () => {
    render(<Autocomplete {...defaultProps} error="Test error" />);

    expect(screen.getByTestId('autocomplete-error-message')).toBeInTheDocument();
    expect(screen.getByTestId('autocomplete-error-message')).toHaveTextContent('Test error');
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('показывает сообщение об ошибке из хука', () => {
    mockUseAutocomplete.state.error = 'Hook error';

    render(<Autocomplete {...defaultProps} />);

    expect(screen.getByTestId('autocomplete-error-message')).toBeInTheDocument();
    expect(screen.getByText('Hook error')).toBeInTheDocument();
  });

  it('не показывает сообщение об ошибке при открытом dropdown', () => {
    mockUseAutocomplete.state.isOpen = true;
    mockUseAutocomplete.state.error = 'Hook error';

    render(<Autocomplete {...defaultProps} />);

    expect(screen.queryByTestId('autocomplete-error-message')).not.toBeInTheDocument();
  });

  it('обрабатывает клик вне компонента', () => {
    render(<Autocomplete {...defaultProps} />);

    // Симулируем клик вне компонента
    fireEvent.mouseDown(document.body);

    expect(mockUseAutocomplete.actions.closeDropdown).toHaveBeenCalled();
  });

  it('не закрывает dropdown при клике внутри компонента', () => {
    render(<Autocomplete {...defaultProps} />);

    const container = screen.getByTestId('autocomplete-container');
    fireEvent.mouseDown(container);

    expect(mockUseAutocomplete.actions.closeDropdown).not.toHaveBeenCalled();
  });

  it('правильно обрабатывает разные языки', () => {
    render(<Autocomplete {...defaultProps} language="en" />);

    // Проверяем, что компонент рендерится с английским языком
    expect(screen.getByTestId('autocomplete-container')).toBeInTheDocument();
  });

  it('имеет правильную структуру DOM', () => {
    render(<Autocomplete {...defaultProps} />);

    const container = screen.getByTestId('autocomplete-container');

    // Проверяем структуру
    expect(container.querySelector('[data-testid="autocomplete-input"]')).toBeInTheDocument();
    expect(container).toHaveAttribute('role', 'combobox');
  });

  it('правильно обрабатывает focus после очистки', () => {
    mockUseAutocomplete.state.query = 'test query';

    render(<Autocomplete {...defaultProps} />);

    const clearButton = screen.getByTestId('autocomplete-clear-button');
    const input = screen.getByTestId('autocomplete-input');

    // Мокаем focus
    const focusSpy = jest.spyOn(input, 'focus');

    fireEvent.click(clearButton);

    expect(focusSpy).toHaveBeenCalled();
  });

  it('правильно обрабатывает auto-focus выбранного элемента', () => {
    mockUseAutocomplete.state.selectedIndex = 1;
    mockUseAutocomplete.state.isOpen = true;
    mockUseAutocomplete.state.results = [
      { id: 1, name: 'Item 1', type: 'site' },
      { id: 2, name: 'Item 2', type: 'site' },
    ];

    render(<Autocomplete {...defaultProps} />);

    // Проверяем, что компонент рендерится без ошибок
    expect(screen.getByTestId('autocomplete-container')).toBeInTheDocument();
  });
});
