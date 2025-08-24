import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Input';

describe('Input', () => {
  it('рендерит базовый input', () => {
    render(<Input placeholder="Введите текст" />);
    expect(screen.getByPlaceholderText('Введите текст')).toBeInTheDocument();
  });

  it('применяет переданные props', () => {
    render(
      <Input placeholder="Тест" value="test value" onChange={() => {}} data-testid="test-input" />,
    );

    const input = screen.getByTestId('test-input');
    expect(input).toHaveValue('test value');
  });

  it('отображает лейбл', () => {
    render(<Input label="Тестовый лейбл" />);
    expect(screen.getByText('Тестовый лейбл')).toBeInTheDocument();
  });

  it('отображает описание', () => {
    render(<Input description="Тестовое описание" />);
    expect(screen.getByText('Тестовое описание')).toBeInTheDocument();
  });

  it('отображает ошибку', () => {
    render(<Input error="Тестовая ошибка" />);
    expect(screen.getByText('Тестовая ошибка')).toBeInTheDocument();
  });

  it('отображает индикатор загрузки', () => {
    render(<Input loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('отображает кнопку очистки когда clearable=true и есть значение', () => {
    const onClear = jest.fn();
    render(<Input clearable value="test" onChange={() => {}} onClear={onClear} />);

    const clearButton = screen.getByRole('button', { name: /очистить поле/i });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalled();
  });

  it('не отображает кнопку очистки когда нет значения', () => {
    render(<Input clearable value="" onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: /очистить поле/i })).not.toBeInTheDocument();
  });

  it('применяет disabled состояние', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('применяет различные размеры', () => {
    const { rerender } = render(<Input size="small" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveClass('px-3', 'py-2', 'text-sm');

    rerender(<Input size="large" />);
    input = screen.getByRole('textbox');
    expect(input).toHaveClass('px-5', 'py-4', 'text-lg');
  });

  it('применяет различные варианты', () => {
    const { rerender } = render(<Input variant="outline" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-transparent');

    rerender(<Input variant="filled" />);
    input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-slate-50');
  });

  it('передает ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('применяет кастомные классы', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('применяет containerClassName', () => {
    render(<Input containerClassName="container-class" />);
    expect(screen.getByRole('textbox').parentElement?.parentElement).toHaveClass('container-class');
  });
});
