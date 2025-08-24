/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { getI18n } from '@/i18n/i18n.client';
import { useAuthForm, AuthFormConfig } from '../useAuthForm';

// Мокаем setTimeout для ускорения тестов
jest.useFakeTimers();

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(I18nextProvider, { i18n: getI18n() }, children);
};

describe('useAuthForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('инициализирует форму с пустыми значениями', () => {
    const config: AuthFormConfig = {
      fields: [
        { name: 'email', type: 'email', label: 'Email', placeholder: 'email@example.com' },
        { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
      ],
      onSubmit: mockOnSubmit,
    };

    const { result } = renderHook(() => useAuthForm(config), { wrapper });

    expect(result.current.formData).toEqual({
      email: '',
      password: '',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('обрабатывает изменения полей', () => {
    const config: AuthFormConfig = {
      fields: [
        { name: 'email', type: 'email', label: 'Email', placeholder: 'email@example.com' },
        { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
      ],
      onSubmit: mockOnSubmit,
    };

    const { result } = renderHook(() => useAuthForm(config), { wrapper });

    act(() => {
      result.current.handleInputChange('email', 'test@example.com');
    });

    expect(result.current.formData.email).toBe('test@example.com');

    act(() => {
      result.current.handleInputChange('password', 'password123');
    });

    expect(result.current.formData.password).toBe('password123');
  });

  it('валидирует email корректно', () => {
    const config: AuthFormConfig = {
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'email@example.com',
          required: true,
        },
      ],
      onSubmit: mockOnSubmit,
    };

    const { result } = renderHook(() => useAuthForm(config), { wrapper });

    // Пустой email
    act(() => {
      result.current.handleInputChange('email', '');
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.email).toBeDefined();

    // Невалидный email
    act(() => {
      result.current.handleInputChange('email', 'invalid-email');
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.email).toBeDefined();

    // Валидный email
    act(() => {
      result.current.handleInputChange('email', 'test@example.com');
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('валидирует пароль корректно', () => {
    const config: AuthFormConfig = {
      fields: [
        {
          name: 'password',
          type: 'password',
          label: 'Password',
          placeholder: '••••••••',
          required: true,
        },
      ],
      onSubmit: mockOnSubmit,
    };

    const { result } = renderHook(() => useAuthForm(config), { wrapper });

    // Пустой пароль
    act(() => {
      result.current.handleInputChange('password', '');
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.password).toBeDefined();

    // Короткий пароль
    act(() => {
      result.current.handleInputChange('password', '123');
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.password).toBeDefined();

    // Валидный пароль
    act(() => {
      result.current.handleInputChange('password', 'password123');
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.password).toBeUndefined();
  });

  it('валидирует подтверждение пароля', () => {
    const config: AuthFormConfig = {
      fields: [
        {
          name: 'password',
          type: 'password',
          label: 'Password',
          placeholder: '••••••••',
          required: true,
        },
        {
          name: 'confirmPassword',
          type: 'password',
          label: 'Confirm Password',
          placeholder: '••••••••',
          required: true,
        },
      ],
      onSubmit: mockOnSubmit,
    };

    const { result } = renderHook(() => useAuthForm(config), { wrapper });

    // Устанавливаем пароль
    act(() => {
      result.current.handleInputChange('password', 'password123');
    });

    // Несовпадающие пароли
    act(() => {
      result.current.handleInputChange('confirmPassword', 'different123');
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.confirmPassword).toBeDefined();

    // Совпадающие пароли
    act(() => {
      result.current.handleInputChange('confirmPassword', 'password123');
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.confirmPassword).toBeUndefined();
  });

  it('вызывает onSubmit при успешной валидации', async () => {
    const config: AuthFormConfig = {
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'email@example.com',
          required: true,
        },
        {
          name: 'password',
          type: 'password',
          label: 'Password',
          placeholder: '••••••••',
          required: true,
        },
      ],
      onSubmit: mockOnSubmit,
    };

    const { result } = renderHook(() => useAuthForm(config), { wrapper });

    // Заполняем форму валидными данными
    act(() => {
      result.current.handleInputChange('email', 'test@example.com');
      result.current.handleInputChange('password', 'password123');
    });

    // Создаем mock event
    const mockEvent = {
      preventDefault: jest.fn(),
    } as any;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('не вызывает onSubmit при неуспешной валидации', async () => {
    const config: AuthFormConfig = {
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'email@example.com',
          required: true,
        },
      ],
      onSubmit: mockOnSubmit,
    };

    const { result } = renderHook(() => useAuthForm(config), { wrapper });

    // Оставляем email пустым
    const mockEvent = {
      preventDefault: jest.fn(),
    } as any;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
