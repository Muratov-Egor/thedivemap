import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

// Простая иконка для тестов
const TestIcon = () => (
  <svg data-testid="test-icon" className="w-4 h-4" viewBox="0 0 24 24">
    <path d="M12 4v16m8-8H4" />
  </svg>
);

describe('Button Component', () => {
  it('рендерит кнопку с текстом', () => {
    render(<Button>Тестовая кнопка</Button>);
    expect(screen.getByRole('button', { name: 'Тестовая кнопка' })).toBeInTheDocument();
  });

  it('применяет правильные классы по умолчанию', () => {
    render(<Button>Кнопка</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-blue-600',
      'text-white',
      'rounded-xl',
    );
  });

  it('поддерживает разные размеры', () => {
    const { rerender } = render(<Button size="small">Маленькая</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');

    rerender(<Button size="large">Большая</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-8', 'py-4', 'text-base');
  });

  it('поддерживает разные варианты стилей', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r', 'from-yellow-500', 'to-orange-500');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent', 'text-gray-700');

    rerender(<Button variant="white">White</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-gradient-to-r',
      'from-gray-50',
      'to-gray-100',
    );

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r', 'from-red-400', 'to-red-600');
  });

  it('поддерживает круглую форму', () => {
    render(<Button shape="circle">Круглая</Button>);
    expect(screen.getByRole('button')).toHaveClass('rounded-full');
  });

  it('рендерит иконку слева по умолчанию', () => {
    render(<Button icon={<TestIcon />}>С иконкой</Button>);
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('test-icon');

    expect(icon).toBeInTheDocument();
    expect(button.firstChild).toContainElement(icon);
  });

  it('рендерит иконку справа', () => {
    render(
      <Button icon={<TestIcon />} iconPosition="right">
        С иконкой
      </Button>,
    );
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('test-icon');

    expect(icon).toBeInTheDocument();
    expect(button.lastChild).toContainElement(icon);
  });

  it('рендерит только иконку', () => {
    render(<Button icon={<TestIcon />} />);
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('test-icon');

    expect(icon).toBeInTheDocument();
    expect(button.children).toHaveLength(1);
    expect(button.textContent).toBe('');
  });

  it('показывает состояние загрузки', () => {
    render(<Button loading>Загрузка</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('поддерживает состояние disabled', () => {
    render(<Button disabled>Отключена</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('вызывает onClick при клике', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Кликни меня</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('не вызывает onClick когда disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Отключена
      </Button>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('не вызывает onClick когда loading', () => {
    const handleClick = jest.fn();
    render(
      <Button loading onClick={handleClick}>
        Загрузка
      </Button>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('поддерживает дополнительные классы', () => {
    render(<Button className="custom-class">Кнопка</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('передает дополнительные пропсы', () => {
    render(
      <Button data-testid="custom-button" aria-label="Описание">
        Кнопка
      </Button>,
    );
    const button = screen.getByTestId('custom-button');

    expect(button).toHaveAttribute('aria-label', 'Описание');
  });

  it('поддерживает ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Кнопка</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
