import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import I18nProvider from '@/i18n/I18nProvider';
import Header from '../Header/Header';

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

// Мокаем next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Мокаем useMediaQuery
const mockUseIsMobile = jest.fn();
jest.mock('@/hooks/useMediaQuery', () => ({
  useIsMobile: () => mockUseIsMobile(),
}));

// Мокаем useAuth
const mockSignOut = jest.fn();
const mockUseAuth = jest.fn();
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Создаем обертку с провайдерами
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <I18nProvider>{component}</I18nProvider>
    </ThemeProvider>,
  );
};

describe('Header', () => {
  beforeEach(() => {
    mockUseIsMobile.mockReturnValue(false);
    mockUseAuth.mockReturnValue({
      user: null,
      signOut: mockSignOut,
    });
    mockPush.mockClear();
    mockSignOut.mockClear();
  });

  it('рендерит заголовок с логотипом и названием', () => {
    renderWithProviders(<Header />);

    const logo = screen.getByTestId('header-logo');
    const title = screen.getByRole('heading', { level: 1 });

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/img/Logo.svg');
    expect(logo).toHaveAttribute('width', '64');
    expect(logo).toHaveAttribute('height', '64');
    expect(logo).toHaveClass('sm:w-24', 'sm:h-24', 'w-16', 'h-16');

    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-lg', 'sm:text-3xl', 'font-bold');
  });

  it('рендерит ссылку на главную страницу', () => {
    renderWithProviders(<Header />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass(
      'flex',
      'sm:gap-2',
      'gap-1',
      'items-center',
      'hover:no-underline',
      'pr-4',
    );
  });

  it('рендерит header с правильными классами', () => {
    const { container } = renderWithProviders(<Header />);

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
    renderWithProviders(<Header />);

    const logo = screen.getByTestId('header-logo');
    expect(logo).toHaveAttribute('alt', '');
    expect(logo).toHaveAttribute('src', '/img/Logo.svg');
  });

  it('содержит кнопку входа для неавторизованного пользователя', () => {
    renderWithProviders(<Header />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('содержит информацию о пользователе и кнопку выхода для авторизованного пользователя', () => {
    mockUseAuth.mockReturnValue({
      user: { name: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
    });

    renderWithProviders(<Header />);

    const userInfo = screen.getByText('Test User');
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    expect(userInfo).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  it('содержит компонент переключения темы в мобильной версии', () => {
    // Мокаем мобильную версию
    mockUseIsMobile.mockReturnValue(true);

    renderWithProviders(<Header />);

    // В мобильной версии должен быть кнопка меню
    const menuButton = screen.getByRole('button');
    expect(menuButton).toBeInTheDocument();
  });
});
