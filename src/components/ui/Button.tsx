'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'white' | 'ghost' | 'danger' | 'success';
  shape?: 'rounded' | 'circle';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  loading?: boolean;
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
      disabled,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation('common');
    
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 water-shimmer-multiple';

    const sizeStyles = {
      small: {
        rounded: 'px-4 py-2 text-sm gap-1.5 font-medium',
        circle: 'w-10 h-10 text-sm',
      },
      medium: {
        rounded: 'px-6 py-3 text-sm gap-2 font-semibold',
        circle: 'w-12 h-12 text-base',
      },
      large: {
        rounded: 'px-8 py-4 text-base gap-2.5 font-bold',
        circle: 'w-16 h-16 text-lg',
      },
    };

    const variantStyles = {
      primary:
        'bg-blue-600 text-white hover:from-blue-700 hover:to-blue-500 focus:ring-blue-400 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200 border-0',
      secondary:
        'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 focus:ring-yellow-400 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200 border-0',
      white:
        'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 hover:from-gray-100 hover:to-gray-200 focus:ring-gray-400 border border-gray-200 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200',
      ghost:
        'bg-transparent text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 focus:ring-gray-400 hover:scale-105 transform transition-all duration-200',
      danger:
        'bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-400 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200 border-0',
      success:
        'bg-gradient-to-r from-green-400 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-400 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200 border-0',
    };

    const shapeStyles = {
      rounded: 'rounded-xl',
      circle: 'rounded-full',
    };

    const classes = cn(
      baseStyles,
      sizeStyles[size][shape],
      variantStyles[variant],
      shapeStyles[shape],
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
