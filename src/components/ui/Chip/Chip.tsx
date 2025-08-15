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
  ({ className, selected = false, children, icon, iconPosition = 'left', variant = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';

    const variantStyles = {
      default: {
        selected: 'bg-tropical-blue text-white border border-tropical-blue shadow-sm hover:bg-deep-ocean',
        unselected: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400'
      },
      subtle: {
        selected: 'bg-blue-100 text-tropical-blue border-2 border-tropical-blue hover:bg-blue-200',
        unselected: 'bg-white text-slate-600 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
      }
    };

    const stateStyles = variantStyles[variant][selected ? 'selected' : 'unselected'];

    const classes = cn(
      baseStyles,
      'rounded-2xl',
      stateStyles,
      className
    );

    const renderContent = () => {
      if (!children && icon) {
        // Только иконка
        return <span className="flex items-center justify-center">{icon}</span>;
      }

      if (children && icon) {
        // Иконка + текст
        const iconElement = <span className="flex-shrink-0 flex items-center justify-center">{icon}</span>;
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
      <button
        ref={ref}
        className={classes}
        aria-pressed={selected}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

Chip.displayName = 'Chip';

export default Chip;
