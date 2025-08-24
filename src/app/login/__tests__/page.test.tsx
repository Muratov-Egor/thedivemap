import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { getI18n } from '@/i18n/i18n.client';
import LoginPage from '../page';

// Мокаем консоль для проверки вывода
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

// Мокаем setTimeout для ускорения тестов
jest.useFakeTimers();

// Мокаем компоненты, которые требуют провайдеры
jest.mock('@/components/Header/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('@/components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

// Мокаем Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    has: jest.fn(),
  }),
}));

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={getI18n()}>{component}</I18nextProvider>);
};

describe('LoginPage', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    jest.useRealTimers();
  });

  it('отображает форму логина с правильными полями', () => {
    renderWithI18n(<LoginPage />);

    // Проверяем заголовок (используем getAllByText для множественных элементов)
    const loginElements = screen.getAllByText('Login');
    expect(loginElements.length).toBeGreaterThan(0);

    expect(screen.getByPlaceholderText('example@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('успешно отправляет форму с корректными данными', async () => {
    renderWithI18n(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('example@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    // Проверяем, что кнопка показывает состояние загрузки
    expect(submitButton).toBeDisabled();

    // Ускоряем время для завершения имитации задержки
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockConsoleLog).toHaveBeenCalledWith('=== ЛОГИН ФОРМА ===');
      expect(mockConsoleLog).toHaveBeenCalledWith('Email:', 'test@example.com');
      expect(mockConsoleLog).toHaveBeenCalledWith('Password:', 'password123');
    });
  });

  it('отображает ссылку на регистрацию', () => {
    renderWithI18n(<LoginPage />);

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Register')).toHaveAttribute('href', '/register');
  });

  it('отображает Header и Footer', () => {
    renderWithI18n(<LoginPage />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('обрабатывает изменения в полях ввода', () => {
    renderWithI18n(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('example@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    fireEvent.change(emailInput, { target: { value: 'new@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

    expect(emailInput).toHaveValue('new@email.com');
    expect(passwordInput).toHaveValue('newpassword');
  });
});
