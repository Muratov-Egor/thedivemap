'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large' | 'xl';
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'outline'
    | 'glass'
    | 'coral';
  shape?: 'rounded' | 'circle' | 'pill';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  loading?: boolean;
  shimmer?: boolean;
  glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      size = 'medium',
      variant = 'primary',
      shape = 'rounded',
      icon,
      iconPosition = 'left',
      children,
      loading = false,
      shimmer = false,
      glow = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation('common');

    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform hover:-translate-y-0.5 active:translate-y-0';

    const sizeStyles = {
      small: {
        rounded: 'px-4 py-2 text-sm gap-1.5 font-medium',
        circle: 'w-10 h-10 text-sm',
        pill: 'px-4 py-2 text-sm gap-1.5 font-medium',
      },
      medium: {
        rounded: 'px-6 py-3 text-sm gap-2 font-semibold',
        circle: 'w-12 h-12 text-base',
        pill: 'px-6 py-3 text-sm gap-2 font-semibold',
      },
      large: {
        rounded: 'px-8 py-4 text-base gap-2.5 font-bold',
        circle: 'w-16 h-16 text-lg',
        pill: 'px-8 py-4 text-base gap-2.5 font-bold',
      },
      xl: {
        rounded: 'px-10 py-5 text-lg gap-3 font-bold',
        circle: 'w-20 h-20 text-xl',
        pill: 'px-10 py-5 text-lg gap-3 font-bold',
      },
    };

    const variantStyles = {
      // ===== ИСПРАВЛЕННАЯ СИСТЕМА АКЦЕНТОВ =====
      // Primary - основные действия (контрастный синий)
      primary:
        'bg-primary-action dark:bg-primary-action/80 text-white border-2 border-primary-action hover:bg-blue-600 hover:border-blue-600 hover:shadow-primary-shadow focus:ring-2 focus:ring-primary-action/50 shadow-simple button-shine transition-all duration-300 active:bg-blue-700 dark:hover:bg-blue-500',

      // Secondary - вторичные действия (нейтральные)
      secondary:
        'bg-transparent dark:bg-transparent/80 text-secondary-action border-2 border-secondary-action hover:bg-secondary-action hover:text-white hover:shadow-simple-hover focus:ring-2 focus:ring-secondary-action/50 shadow-simple button-shine transition-all duration-300 active:bg-gray-600 dark:text-gray-300 dark:border-gray-400 dark:hover:bg-gray-400 dark:hover:text-gray-900',

      // Success - успешные действия (контрастный зеленый)
      success:
        'bg-success-accent dark:bg-success-accent/80 text-white border-2 border-success-accent hover:bg-green-600 hover:border-green-600 hover:shadow-success-shadow focus:ring-2 focus:ring-success-accent/50 shadow-simple button-shine transition-all duration-300 active:bg-green-700 dark:hover:bg-green-400',

      // Warning - предупреждения (контрастный желтый)
      warning:
        'bg-warning-accent dark:bg-warning-accent/80 text-white border-2 border-warning-accent hover:bg-amber-600 hover:border-amber-600 hover:shadow-warning-shadow focus:ring-2 focus:ring-warning-accent/50 shadow-simple button-shine transition-all duration-300 active:bg-amber-700 dark:hover:bg-amber-400',

      // Danger - опасные действия (контрастный красный)
      danger:
        'bg-danger-accent dark:bg-danger-accent/80 text-white border-2 border-danger-accent hover:bg-red-600 hover:border-red-600 hover:shadow-danger-shadow focus:ring-2 focus:ring-danger-accent/50 shadow-simple button-shine transition-all duration-300 active:bg-red-700 dark:hover:bg-red-400',

      // Info - информационные действия (контрастный синий)
      info: 'bg-info-accent dark:bg-info-accent/80 text-white border-2 border-info-accent hover:bg-blue-600 hover:border-blue-600 hover:shadow-primary-shadow focus:ring-2 focus:ring-info-accent/50 shadow-simple button-shine transition-all duration-300 active:bg-blue-700 dark:hover:bg-blue-500',

      // Outline - обводка (контрастные границы)
      outline:
        'bg-transparent dark:bg-transparent/80 text-outline-purple border-2 border-outline-purple hover:bg-outline-purple hover:text-white hover:shadow-simple-hover focus:ring-2 focus:ring-outline-purple/50 shadow-simple button-shine transition-all duration-300 active:bg-indigo-800 dark:text-indigo-300 dark:border-indigo-400 dark:hover:bg-indigo-400 dark:hover:text-indigo-900',

      // Glass - прозрачная обводка (стеклянный эффект)
      glass:
        'bg-glass-bg/50 dark:bg-glass-bg/50 backdrop-blur-sm text-outline-purple border-2 border-outline-purple/30 hover:border-outline-purple hover:bg-glass-bg/70 hover:shadow-simple-hover focus:ring-2 focus:ring-outline-purple/50 shadow-simple button-shine transition-all duration-300 dark:text-indigo-300 dark:border-indigo-400/30 dark:hover:border-indigo-400',

      // Coral - кормальные действия (контрастный оранжевый)
      coral:
        'bg-coral-action dark:bg-coral-action/80 text-white border-2 border-coral-action hover:bg-coral-action hover:text-white hover:shadow-simple-hover focus:ring-2 focus:ring-coral-action/50 shadow-simple button-shine transition-all duration-300 active:bg-coral-action-700 dark:hover:bg-coral-action-400',

    };

    const shapeStyles = {
      rounded: 'rounded-2xl',
      circle: 'rounded-full',
      pill: 'rounded-full',
    };

    // Добавляем эффекты
    const effectStyles = cn(shimmer && 'water-shimmer-multiple', glow && 'animate-pulse-glow');

    const classes = cn(
      baseStyles,
      sizeStyles[size][shape],
      variantStyles[variant],
      shapeStyles[shape],
      effectStyles,
      className,
    );

    const renderContent = () => {
      if (loading) {
        return (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            {children && <span>{children}</span>}
          </>
        );
      }

      if (!children && icon) {
        // Только иконка
        return icon;
      }

      if (children && icon) {
        // Текст + иконка
        const iconElement = <span className="flex-shrink-0">{icon}</span>;
        return (
          <>
            {iconPosition === 'left' && iconElement}
            <span>{children}</span>
            {iconPosition === 'right' && iconElement}
          </>
        );
      }

      // Только текст
      return children;
    };

    // Добавляем aria-label для кнопок без текста
    const getAriaLabel = () => {
      if (children) return undefined; // Если есть текст, aria-label не нужен

      if (loading) return t('button.accessibility.loading');
      if (disabled) return t('button.accessibility.disabled');

      // Если есть иконка, описываем её назначение
      if (icon) {
        return t('button.accessibility.withIcon');
      }

      return t('button.accessibility.empty');
    };

    const ariaLabel = getAriaLabel();

    const finalAriaLabel = ariaLabel || props['aria-label'];

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-label={finalAriaLabel}
        {...props}
      >
        {renderContent()}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
