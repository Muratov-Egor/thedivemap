'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large' | 'xl';
  variant?: 'primary' | 'secondary' | 'coral' | 'glass' | 'ghost' | 'success' | 'gallery' | 'sun';
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
      primary:
        'bg-gradient-ocean dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-800 text-white hover:shadow-glow-hover dark:hover:from-blue-500 dark:hover:to-blue-700 focus:ring-tropical-blue/50 dark:focus:ring-blue-400 shadow-glow button-shine transform transition-all duration-300 border border-white/30 dark:border-blue-400/30 backdrop-blur-sm',
      secondary:
        'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-slate-700 dark:text-slate-200 hover:from-slate-200 hover:to-slate-300 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:ring-slate-400 dark:focus:ring-slate-500 shadow-md hover:shadow-lg button-shine transform transition-all duration-300 border border-slate-300 dark:border-slate-600',
      coral:
        'bg-gradient-coral dark:bg-gradient-to-r dark:from-orange-500 dark:to-red-600 text-white hover:shadow-glow-coral dark:hover:from-orange-400 dark:hover:to-red-500 focus:ring-coral/50 dark:focus:ring-orange-400 shadow-glow-coral button-shine transform transition-all duration-300 border border-white/30 dark:border-orange-400/30 backdrop-blur-sm',
      glass:
        'bg-glass-bg text-foreground hover:bg-glass-bg/90 focus:ring-slate-400 dark:focus:ring-slate-500 shadow-glass hover:shadow-glass-hover button-shine transform transition-all duration-300 border border-slate-200 dark:border-slate-600 backdrop-blur-xl',
      ghost:
        'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 focus:ring-slate-400 dark:focus:ring-slate-500 button-shine transform transition-all duration-300 border border-slate-200 dark:border-slate-600',
      success:
        'bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-500 dark:hover:to-emerald-600 focus:ring-green-400 dark:focus:ring-emerald-400 shadow-lg hover:shadow-xl button-shine transform transition-all duration-300 border-0',
      sun:
        'bg-gradient-to-r from-yellow-300 to-yellow-500 dark:from-yellow-500 dark:to-amber-600 text-gray-900 dark:text-white hover:from-yellow-200 hover:to-yellow-400 dark:hover:from-yellow-400 dark:hover:to-amber-500 focus:ring-yellow-400 dark:focus:ring-amber-400 shadow-lg hover:shadow-xl hover:shadow-yellow-200/50 dark:hover:shadow-amber-200/30 button-shine transform transition-all duration-300 border border-yellow-300/50 dark:border-amber-400/30 backdrop-blur-sm',
      gallery:
        'bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 text-white hover:bg-opacity-70 dark:hover:bg-opacity-80 focus:ring-white/30 dark:focus:ring-gray-400/30 border-0 shadow-none backdrop-blur-sm',
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
