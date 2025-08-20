import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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
    expect(button).toHaveClass('bg-gradient-ocean', 'text-white', 'rounded-2xl');
  });

  it('поддерживает разные размеры', () => {
    const { rerender } = render(<Button size="small">Маленькая</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');

    rerender(<Button size="medium">Средняя</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-sm');

    rerender(<Button size="large">Большая</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-8', 'py-4', 'text-base');

    rerender(<Button size="xl">Очень большая</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-10', 'py-5', 'text-lg');
  });

  it('поддерживает разные варианты стилей', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-gradient-to-r',
      'from-gray-200',
      'to-gray-300',
    );

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent', 'text-slate-600');

    rerender(<Button variant="coral">Coral</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-coral', 'text-white');

    rerender(<Button variant="glass">Glass</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-glass-bg', 'text-foreground');

    rerender(<Button variant="success">Success</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-gradient-to-r',
      'from-green-500',
      'to-emerald-600',
    );
  });

  it('поддерживает разные формы', () => {
    const { rerender } = render(<Button shape="rounded">Округлая</Button>);
    expect(screen.getByRole('button')).toHaveClass('rounded-2xl');

    rerender(<Button shape="circle">Круглая</Button>);
    expect(screen.getByRole('button')).toHaveClass('rounded-full');

    rerender(<Button shape="pill">Таблетка</Button>);
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

  it('показывает состояние загрузки без текста', () => {
    render(<Button loading />);
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

  it('поддерживает эффекты shimmer и glow', () => {
    const { rerender } = render(<Button shimmer>Shimmer</Button>);
    expect(screen.getByRole('button')).toHaveClass('water-shimmer-multiple');

    rerender(<Button glow>Glow</Button>);
    expect(screen.getByRole('button')).toHaveClass('animate-pulse-glow');

    rerender(
      <Button shimmer glow>
        Shimmer + Glow
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('water-shimmer-multiple', 'animate-pulse-glow');
  });

  it('добавляет aria-label для кнопок без текста', () => {
    render(<Button />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('добавляет aria-label для кнопок с иконкой без текста', () => {
    render(<Button icon={<TestIcon />} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('добавляет aria-label для кнопок в состоянии загрузки', () => {
    render(<Button loading />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('добавляет aria-label для отключенных кнопок', () => {
    render(<Button disabled />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('не добавляет aria-label для кнопок с текстом', () => {
    render(<Button>Текст кнопки</Button>);
    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('aria-label');
  });

  it('приоритет пользовательского aria-label над автоматическим', () => {
    render(<Button aria-label="Пользовательский label" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Пользовательский label');
  });

  it('правильно рендерит иконку и текст в правильном порядке', () => {
    render(
      <Button icon={<TestIcon />} iconPosition="right">
        Текст справа
      </Button>,
    );
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('test-icon');

    expect(button.firstChild).toHaveTextContent('Текст справа');
    expect(button.lastChild).toContainElement(icon);
  });

  it('правильно рендерит иконку и текст слева', () => {
    render(
      <Button icon={<TestIcon />} iconPosition="left">
        Текст слева
      </Button>,
    );
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('test-icon');

    expect(button.firstChild).toContainElement(icon);
    expect(button.lastChild).toHaveTextContent('Текст слева');
  });

  it('поддерживает все размеры для круглой формы', () => {
    const { rerender } = render(<Button shape="circle" size="small" />);
    expect(screen.getByRole('button')).toHaveClass('w-10', 'h-10');

    rerender(<Button shape="circle" size="medium" />);
    expect(screen.getByRole('button')).toHaveClass('w-12', 'h-12');

    rerender(<Button shape="circle" size="large" />);
    expect(screen.getByRole('button')).toHaveClass('w-16', 'h-16');

    rerender(<Button shape="circle" size="xl" />);
    expect(screen.getByRole('button')).toHaveClass('w-20', 'h-20');
  });

  it('поддерживает все размеры для формы pill', () => {
    const { rerender } = render(
      <Button shape="pill" size="small">
        Pill
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2');

    rerender(
      <Button shape="pill" size="medium">
        Pill
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3');

    rerender(
      <Button shape="pill" size="large">
        Pill
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('px-8', 'py-4');

    rerender(
      <Button shape="pill" size="xl">
        Pill
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('px-10', 'py-5');
  });
});
