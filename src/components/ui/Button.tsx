'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large' | 'xl';
  variant?: 'primary' | 'secondary' | 'coral' | 'glass' | 'ghost' | 'success';
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
        'bg-gradient-ocean text-white hover:shadow-glow-hover focus:ring-tropical-blue/50 shadow-glow hover:scale-105 transform transition-all duration-300 border border-white/30 backdrop-blur-sm',
      secondary:
        'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 focus:ring-slate-400 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 border border-slate-300',
      coral:
        'bg-gradient-coral text-white hover:shadow-glow-coral focus:ring-coral/50 shadow-glow-coral hover:scale-105 transform transition-all duration-300 border border-white/30 backdrop-blur-sm',
      glass:
        'bg-white/80 text-slate-800 hover:bg-white focus:ring-slate-400 shadow-glass hover:shadow-glass-hover hover:scale-105 transform transition-all duration-300 border border-slate-200 backdrop-blur-xl',
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400 hover:scale-105 transform transition-all duration-300 border border-slate-200',
      success:
        'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-400 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 border-0',
    };

    const shapeStyles = {
      rounded: 'rounded-2xl',
      circle: 'rounded-full',
      pill: 'rounded-full',
    };

    // Добавляем эффекты
    const effectStyles = cn(
      shimmer && 'water-shimmer-multiple',
      glow && 'animate-pulse-glow',
    );

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
