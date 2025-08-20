import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

// Мокаем next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, className, 'data-testid': testId }: any) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-testid={testId}
      />
    );
  };
});

// Мокаем next/link
jest.mock('next/link', () => {
  return function MockLink({ href, children, className }: any) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

// Мокаем LanguageSwitch
jest.mock('@/components/LanguageSwitch', () => {
  return function MockLanguageSwitch() {
    return <div data-testid="language-switch">Language Switch</div>;
  };
});

// Мокаем ThemeContext
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: any) => <div>{children}</div>,
}));

// Мокаем ThemeToggle
jest.mock('@/components/ui/ThemeToggle', () => ({
  ThemeToggle: function MockThemeToggle() {
    return <div data-testid="theme-toggle">Theme Toggle</div>;
  },
}));

describe('Header', () => {
  it('рендерит заголовок с логотипом и названием', () => {
    render(<Header />);

    const logo = screen.getByTestId('header-logo');
    const title = screen.getByRole('heading', { level: 1 });
    const languageSwitch = screen.getByTestId('language-switch');

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/img/Logo.ico');
    expect(logo).toHaveAttribute('width', '64');
    expect(logo).toHaveAttribute('height', '64');
    expect(logo).toHaveClass('sm:w-24', 'sm:h-24', 'w-16', 'h-16');

    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-xl', 'sm:text-3xl', 'font-bold');

    expect(languageSwitch).toBeInTheDocument();
  });

  it('рендерит ссылку на главную страницу', () => {
    render(<Header />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass(
      'flex',
      'sm:gap-2',
      'gap-1',
      'items-center',
      'hover:underline',
      'pr-4',
    );
  });

  it('рендерит header с правильными классами', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass(
      'sm:py-2',
      'sm:px-10',
      'p-2',
      'flex',
      'justify-between',
      'items-center',
      'border-b',
      'border-gray-200',
    );
  });

  it('содержит логотип с правильными атрибутами', () => {
    render(<Header />);

    const logo = screen.getByTestId('header-logo');
    expect(logo).toHaveAttribute('alt', '');
    expect(logo).toHaveAttribute('src', '/img/Logo.ico');
  });

  it('содержит компонент переключения языка', () => {
    render(<Header />);

    const languageSwitch = screen.getByTestId('language-switch');
    expect(languageSwitch).toBeInTheDocument();
    expect(languageSwitch).toHaveTextContent('Language Switch');
  });
});
