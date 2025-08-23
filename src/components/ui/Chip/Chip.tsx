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
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer min-w-20 active:scale-95';

    // СБАЛАНСИРОВАННЫЙ ДИЗАЙН - спокойные цвета для множественного выбора
    const variantStyles = {
      default: {
        selected:
          'bg-pastel-blue border-2 border-outline-purple text-outline-purple dark:text-black shadow-simple hover:bg-pastel-blue/80 hover:shadow-simple-hover focus:ring-pastel-blue/50',
        unselected:
          'bg-white dark:bg-gray-800 border-2 border-outline-purple/40 text-outline-purple dark:text-white hover:bg-pastel-blue/20 hover:border-outline-purple focus:ring-outline-purple/30',
      },
      subtle: {
        selected:
          'bg-pastel-blue/60 border border-outline-purple text-outline-purple dark:text-black shadow-simple hover:bg-pastel-blue/80 hover:shadow-simple-hover focus:ring-pastel-blue/50',
        unselected:
          'bg-white dark:bg-gray-800 border border-outline-purple/30 text-outline-purple/80 dark:text-white/90 hover:bg-pastel-blue/15 hover:border-outline-purple/50 focus:ring-outline-purple/30',
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
