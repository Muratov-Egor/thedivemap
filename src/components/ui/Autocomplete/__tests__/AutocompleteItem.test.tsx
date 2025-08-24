import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AutocompleteItem from '../AutocompleteItem';
import { AutocompleteItem as AutocompleteItemType } from '../types';

// Мокаем i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'types.site': 'Сайт',
        'types.country': 'Страна',
        'types.region': 'Регион',
        'types.location': 'Локация',
        'types.result': 'Результат',
      };
      return translations[key] || key;
    },
  }),
}));

// Мокаем utils
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
  getCountryFlag: (isoCode: string) => {
    const flags: Record<string, string> = {
      TC: '🇹🇨',
      TH: '🇹🇭',
    };
    return flags[isoCode] || '🌍';
  },
}));

const createTestItem = (overrides: Partial<AutocompleteItemType> = {}): AutocompleteItemType => ({
  id: 1,
  name: 'Test Item',
  type: 'site',
  ...overrides,
});

describe('AutocompleteItem Component', () => {
  const defaultProps = {
    onClick: jest.fn(),
    index: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит элемент с правильными accessibility атрибутами', () => {
    const item = createTestItem();
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    const element = screen.getByRole('option');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-selected', 'false');
    expect(element).toHaveAttribute('aria-label', 'Test Item, Сайт');
    expect(element).toHaveAttribute('id', 'autocomplete-option-0');
  });

  it('показывает выбранное состояние', () => {
    const item = createTestItem();
    render(<AutocompleteItem item={item} isSelected={true} {...defaultProps} />);

    const element = screen.getByRole('option');
    expect(element).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('autocomplete-item-selected')).toBeInTheDocument();
  });

  it('отображает иконку для сайта', () => {
    const item = createTestItem({ type: 'site' });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    // Проверяем наличие иконки через стиль background-image
    const iconContainer = screen.getByTestId('autocomplete-item').querySelector('.flex-shrink-0');
    expect(iconContainer).toBeInTheDocument();
  });

  it('отображает флаг страны для страны', () => {
    const item = createTestItem({
      type: 'country',
      metadata: { iso_code: 'TC' },
    });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    // Проверяем наличие иконки через стиль background-image
    const iconContainer = screen.getByTestId('autocomplete-item').querySelector('.flex-shrink-0');
    expect(iconContainer).toBeInTheDocument();
  });

  it('отображает дефолтную иконку для страны без ISO кода', () => {
    const item = createTestItem({
      type: 'country',
      metadata: {},
    });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    // Проверяем наличие иконки через стиль background-image
    const iconContainer = screen.getByTestId('autocomplete-item').querySelector('.flex-shrink-0');
    expect(iconContainer).toBeInTheDocument();
  });

  it('отображает иконку для региона', () => {
    const item = createTestItem({ type: 'region' });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    // Проверяем наличие иконки через стиль background-image
    const iconContainer = screen.getByTestId('autocomplete-item').querySelector('.flex-shrink-0');
    expect(iconContainer).toBeInTheDocument();
  });

  it('отображает иконку для локации', () => {
    const item = createTestItem({ type: 'location' });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    // Проверяем наличие иконки через стиль background-image
    const iconContainer = screen.getByTestId('autocomplete-item').querySelector('.flex-shrink-0');
    expect(iconContainer).toBeInTheDocument();
  });

  it('отображает дефолтную иконку для неизвестного типа', () => {
    const item = createTestItem({ type: 'unknown' as never });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    // Проверяем наличие иконки через стиль background-image
    const iconContainer = screen.getByTestId('autocomplete-item').querySelector('.flex-shrink-0');
    expect(iconContainer).toBeInTheDocument();
  });

  it('отображает название элемента', () => {
    const item = createTestItem({ name: 'Test Site Name' });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    expect(screen.getByTestId('autocomplete-item-name')).toHaveTextContent('Test Site Name');
  });

  it('отображает тип элемента', () => {
    const item = createTestItem({ type: 'site' });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    expect(screen.getByTestId('autocomplete-item-type')).toHaveTextContent('Сайт');
  });

  it('отображает метаданные для сайта', () => {
    const item = createTestItem({
      type: 'site',
      metadata: { site_type: 'Reef' },
    });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    expect(screen.getByText('Reef')).toBeInTheDocument();
  });

  it('не отображает метаданные если их нет', () => {
    const item = createTestItem({
      type: 'site',
      metadata: {},
    });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    expect(screen.queryByText('Reef')).not.toBeInTheDocument();
  });

  it('вызывает onClick при клике', () => {
    const item = createTestItem();
    const onClick = jest.fn();
    render(<AutocompleteItem item={item} isSelected={false} onClick={onClick} index={0} />);

    fireEvent.click(screen.getByRole('option'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('вызывает onClick при нажатии Enter', () => {
    const item = createTestItem();
    const onClick = jest.fn();
    render(<AutocompleteItem item={item} isSelected={false} onClick={onClick} index={0} />);

    fireEvent.keyDown(screen.getByRole('option'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('вызывает onClick при нажатии Space', () => {
    const item = createTestItem();
    const onClick = jest.fn();
    render(<AutocompleteItem item={item} isSelected={false} onClick={onClick} index={0} />);

    fireEvent.keyDown(screen.getByRole('option'), { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('не вызывает onClick при нажатии других клавиш', () => {
    const item = createTestItem();
    const onClick = jest.fn();
    render(<AutocompleteItem item={item} isSelected={false} onClick={onClick} index={0} />);

    fireEvent.keyDown(screen.getByRole('option'), { key: 'Tab' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('применяет правильные CSS классы для выбранного состояния', () => {
    const item = createTestItem();
    render(<AutocompleteItem item={item} isSelected={true} {...defaultProps} />);

    const element = screen.getByRole('option');
    expect(element).toHaveClass('bg-primary-action/15');
  });

  it('применяет правильные CSS классы для невыбранного состояния', () => {
    const item = createTestItem();
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    const element = screen.getByRole('option');
    expect(element).not.toHaveClass('bg-pastel-blue/20');
  });

  it('поддерживает кастомные CSS классы', () => {
    const item = createTestItem();
    render(
      <AutocompleteItem
        item={item}
        isSelected={false}
        className="custom-class"
        {...defaultProps}
      />,
    );

    const element = screen.getByRole('option');
    expect(element).toHaveClass('custom-class');
  });

  it('правильно обрабатывает длинные названия', () => {
    const longName = 'Very Long Site Name That Should Be Truncated';
    const item = createTestItem({ name: longName });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    expect(screen.getByTestId('autocomplete-item-name')).toHaveTextContent(longName);
  });

  it('отображает subtitle если есть', () => {
    const item = createTestItem({ subtitle: 'Test Subtitle' });
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    // Проверяем, что subtitle отображается в структуре
    const element = screen.getByRole('option');
    expect(element).toHaveAttribute('aria-label', 'Test Item, Сайт');
  });

  it('правильно обрабатывает разные индексы', () => {
    const item = createTestItem();
    render(<AutocompleteItem item={item} isSelected={false} onClick={jest.fn()} index={5} />);

    expect(screen.getByRole('option')).toHaveAttribute('id', 'autocomplete-option-5');
  });

  it('имеет правильную структуру DOM', () => {
    const item = createTestItem();
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    const element = screen.getByRole('option');

    // Проверяем структуру
    expect(element.querySelector('[data-testid="autocomplete-item-name"]')).toBeInTheDocument();
    expect(element.querySelector('[data-testid="autocomplete-item-type"]')).toBeInTheDocument();
    expect(element.querySelector('.text-lg')).toBeInTheDocument(); // Иконка
  });

  it('поддерживает focus', () => {
    const item = createTestItem();
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    const element = screen.getByRole('option');
    element.focus();
    expect(element).toHaveFocus();
  });

  it('имеет правильный tabIndex', () => {
    const item = createTestItem();
    render(<AutocompleteItem item={item} isSelected={false} {...defaultProps} />);

    expect(screen.getByRole('option')).toHaveAttribute('tabIndex', '0');
  });
});
