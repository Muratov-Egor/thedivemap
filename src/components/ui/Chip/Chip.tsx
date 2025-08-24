'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'subtle';
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      selected = false,
      children,
      icon,
      iconPosition = 'left',
      variant = 'subtle',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer min-w-20 active:scale-95 transform hover:-translate-y-0.5 active:translate-y-0';

    // ===== ИСПРАВЛЕННЫЙ КОНТРАСТНЫЙ ДИЗАЙН =====
    const variantStyles = {
      default: {
        // Selected - контрастное активное состояние
        selected:
          'bg-primary-action text-white border-2 border-primary-action shadow-primary-shadow hover:bg-blue-600 hover:shadow-lg focus:ring-2 focus:ring-primary-action/50 active:bg-blue-700 dark:hover:bg-blue-500',
        // Unselected - четкое неактивное состояние
        unselected:
          'bg-slate-100 border-2 border-slate-300 text-slate-700 shadow-simple hover:bg-slate-200 hover:border-slate-400 hover:shadow-simple-hover focus:ring-2 focus:ring-slate-300/50 active:bg-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600 dark:hover:border-slate-500',
      },
      subtle: {
        // Selected - более мягкое активное состояние
        selected:
          'bg-primary-action/20 border border-primary-action text-primary-action shadow-simple hover:bg-primary-action/30 hover:shadow-simple-hover focus:ring-2 focus:ring-primary-action/50 active:bg-primary-action/40 dark:bg-blue-400/20 dark:border-blue-400 dark:text-gray-300',
        // Unselected - мягкое неактивное состояние
        unselected:
          'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 focus:ring-2 focus:ring-slate-200/50 active:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:border-slate-600',
      },
    };

    const stateStyles = variantStyles[variant][selected ? 'selected' : 'unselected'];

    const classes = cn(baseStyles, 'rounded-2xl', stateStyles, className);

    const renderContent = () => {
      if (!children && icon) {
        // Только иконка
        return <span className="flex items-center justify-center">{icon}</span>;
      }

      if (children && icon) {
        // Иконка + текст
        const iconElement = (
          <span className="flex-shrink-0 flex items-center justify-center">{icon}</span>
        );
        return (
          <>
            {iconPosition === 'left' && iconElement}
            <span className="flex items-center">{children}</span>
            {iconPosition === 'right' && iconElement}
          </>
        );
      }

      // Только текст
      return <span className="flex items-center">{children}</span>;
    };

    return (
      <button ref={ref} className={classes} aria-pressed={selected} {...props}>
        {renderContent()}
      </button>
    );
  },
);

Chip.displayName = 'Chip';

export default Chip;
