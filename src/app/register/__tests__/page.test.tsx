import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { getI18n } from '@/i18n/i18n.client';
import RegisterPage from '../page';

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

describe('RegisterPage', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    jest.useRealTimers();
  });

  it('отображает форму регистрации с правильными полями', () => {
    renderWithI18n(<RegisterPage />);

    // Проверяем заголовок
    const registerElements = screen.getAllByText('Register');
    expect(registerElements.length).toBeGreaterThan(0);

    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@email.com')).toBeInTheDocument();

    // Проверяем поля паролей по лейблам
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('успешно отправляет форму с корректными данными', async () => {
    renderWithI18n(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('example@email.com');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    // Проверяем, что кнопка показывает состояние загрузки
    expect(submitButton).toBeDisabled();

    // Ускоряем время для завершения имитации задержки
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockConsoleLog).toHaveBeenCalledWith('=== РЕГИСТРАЦИЯ ===');
      expect(mockConsoleLog).toHaveBeenCalledWith('Name:', 'John Doe');
      expect(mockConsoleLog).toHaveBeenCalledWith('Email:', 'test@example.com');
      expect(mockConsoleLog).toHaveBeenCalledWith('Password:', 'password123');
      expect(mockConsoleLog).toHaveBeenCalledWith('Confirm Password:', 'password123');
    });
  });

  it('отображает ссылку на вход', () => {
    renderWithI18n(<RegisterPage />);

    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Login')).toHaveAttribute('href', '/login');
  });

  it('отображает Header и Footer', () => {
    renderWithI18n(<RegisterPage />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('обрабатывает изменения в полях ввода', () => {
    renderWithI18n(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('example@email.com');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword' } });

    expect(nameInput).toHaveValue('Jane Doe');
    expect(emailInput).toHaveValue('jane@email.com');
    expect(passwordInput).toHaveValue('newpassword');
    expect(confirmPasswordInput).toHaveValue('newpassword');
  });
});
