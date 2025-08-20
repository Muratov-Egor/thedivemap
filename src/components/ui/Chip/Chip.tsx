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
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer min-w-20';

    const variantStyles = {
      default: {
        selected:
          'bg-tropical-blue text-white border border-tropical-blue shadow-sm hover:bg-deep-ocean',
        unselected:
          'bg-glass-bg text-foreground border border-slate-300 dark:border-slate-600 hover:bg-glass-bg/90 hover:border-slate-400 dark:hover:border-slate-500',
      },
      subtle: {
        selected:
          'bg-blue-100 dark:bg-blue-900/50 text-tropical-blue dark:text-blue-300 border-2 border-tropical-blue dark:border-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50',
        unselected:
          'bg-glass-bg text-foreground border-2 border-slate-300 dark:border-slate-600 hover:bg-glass-bg/90 hover:border-slate-400 dark:hover:border-slate-500',
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
