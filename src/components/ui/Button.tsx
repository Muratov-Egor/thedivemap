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
    | 'glass';
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
      'inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

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
      // Primary - основные действия (pastel-blue)
      primary:
        'bg-pastel-blue border-2 border-outline-purple/30 text-outline-purple hover:border-outline-purple hover:shadow-simple-hover focus:ring-pastel-blue/50 shadow-simple button-shine transition-all duration-300 dark:bg-pastel-blue/15 dark:border-pastel-blue dark:text-pastel-blue',

      // Secondary - вторичные действия (pastel-yellow - согласно feedback)
      secondary:
        'bg-pastel-yellow border-2 border-outline-purple/30 text-outline-purple hover:border-outline-purple hover:shadow-simple-hover focus:ring-pastel-yellow/50 shadow-simple button-shine transition-all duration-300 dark:bg-pastel-yellow/15 dark:border-pastel-yellow dark:text-pastel-yellow',

      // Success - успешные действия (pastel-green)
      success:
        'bg-pastel-green border-2 border-outline-purple/30 text-outline-purple hover:border-outline-purple hover:shadow-simple-hover focus:ring-pastel-green/50 shadow-simple button-shine transition-all duration-300 dark:bg-pastel-green/15 dark:border-pastel-green dark:text-pastel-green',

      // Warning - предупреждения (pastel-cream - согласно feedback)
      warning:
        'bg-pastel-cream border-2 border-outline-purple/30 text-outline-purple hover:border-outline-purple hover:shadow-simple-hover focus:ring-pastel-cream/50 shadow-simple button-shine transition-all duration-300 dark:bg-pastel-cream/15 dark:border-pastel-cream dark:text-pastel-cream',

      // Danger - опасные действия (pastel-pink)
      danger:
        'bg-pastel-pink border-2 border-outline-purple/30 text-outline-purple hover:border-outline-purple hover:shadow-simple-hover focus:ring-pastel-pink/50 shadow-simple button-shine transition-all duration-300 dark:bg-pastel-pink/15 dark:border-pastel-pink dark:text-pastel-pink',

      // Info - информационные действия (pastel-turquoise)
      info: 'bg-pastel-turquoise border-2 border-outline-purple/30 text-outline-purple hover:border-outline-purple hover:shadow-simple-hover focus:ring-pastel-turquoise/50 shadow-simple button-shine transition-all duration-300 dark:bg-pastel-turquoise/15 dark:border-pastel-turquoise dark:text-pastel-turquoise',

      // Outline - обводка (pastel-blue)
      outline:
        'bg-transparent border-2 border-outline-purple/30 text-outline-purple hover:border-outline-purple hover:shadow-simple-hover focus:ring-pastel-blue/50 shadow-simple button-shine transition-all duration-300 dark:border-pastel-blue dark:text-pastel-blue',

      // Glass - прозрачная обводка (pastel-blue)
      glass:
        'bg-transparent border-2 border-outline-purple/30 text-outline-purple hover:border-outline-purple hover:shadow-simple-hover focus:ring-pastel-blue/50 shadow-simple button-shine transition-all duration-300 dark:border-pastel-blue dark:text-pastel-blue',
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
