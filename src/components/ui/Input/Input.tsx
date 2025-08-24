'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  // Состояния
  error?: string | boolean;
  loading?: boolean;

  // Размеры
  size?: 'small' | 'medium' | 'large';

  // Варианты
  variant?: 'default' | 'outline' | 'filled';

  // Дополнительные элементы
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;

  // Контейнер
  containerClassName?: string;

  // Лейбл
  label?: string;
  labelClassName?: string;

  // Описание
  description?: string;
  descriptionClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      size = 'medium',
      variant = 'default',
      error,
      loading = false,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      label,
      labelClassName,
      description,
      descriptionClassName,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);
    const showClearButton = clearable && props.value && !loading && !disabled;

    const sizeStyles = {
      small: 'px-3 py-2 text-sm',
      medium: 'px-4 py-3 text-base',
      large: 'px-5 py-4 text-lg',
    };

    const variantStyles = {
      default: 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600',
      outline: 'bg-transparent border-2 border-slate-300 dark:border-slate-500',
      filled: 'bg-slate-50 dark:bg-slate-700 border-2 border-transparent',
    };

    const inputStyles = cn(
      // Базовые стили
      'w-full text-foreground placeholder-slate-500 dark:placeholder-slate-400',
      'rounded-2xl transition-all duration-300 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-primary-action/30 dark:focus:ring-primary-action/40',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'text-slate-800 dark:text-slate-200',

      // Размеры
      sizeStyles[size],

      // Варианты
      variantStyles[variant],

      // Состояния
      !hasError && 'focus:border-primary-action dark:focus:border-primary-action',
      hasError && 'border-danger-accent focus:border-danger-accent focus:ring-danger-accent/20',

      // Отступы для иконок
      leftIcon && 'pl-12',
      (rightIcon || showClearButton || loading) && 'pr-12',

      className,
    );

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('w-full', containerClassName)}>
        {/* Лейбл */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2',
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        {/* Контейнер input */}
        <div className="relative">
          {/* Левая иконка */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400">
              {leftIcon}
            </div>
          )}

          {/* Input поле */}
          <input
            ref={ref}
            id={inputId}
            className={inputStyles}
            disabled={disabled || loading}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? 'input-error-message' : description ? 'input-description' : undefined
            }
            {...props}
          />

          {/* Правая иконка */}
          {rightIcon && !showClearButton && !loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400">
              {rightIcon}
            </div>
          )}

          {/* Индикатор загрузки */}
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div
                className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-action"
                role="status"
                aria-label="Загрузка"
              ></div>
            </div>
          )}

          {/* Кнопка очистки */}
          {showClearButton && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              aria-label="Очистить поле"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Описание */}
        {description && !hasError && (
          <p
            id="input-description"
            className={cn('mt-2 text-sm text-slate-600 dark:text-slate-400', descriptionClassName)}
          >
            {description}
          </p>
        )}

        {/* Сообщение об ошибке */}
        {hasError && (
          <div
            id="input-error-message"
            className="mt-2 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {typeof error === 'string' ? error : 'Произошла ошибка'}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
