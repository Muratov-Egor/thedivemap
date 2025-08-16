'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { FILTER_STYLES } from './constants';

export interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  showCount?: boolean;
  count?: number;
  subtitle?: string;
  isLoading?: boolean;
}

export function FilterSection({
  title,
  children,
  className,
  showCount = false,
  count = 0,
  subtitle,
  isLoading = false,
}: FilterSectionProps) {
  return (
    <div className={cn(FILTER_STYLES.section(), className)}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className={FILTER_STYLES.sectionTitle}>{title}</h3>
          {subtitle && <p className={FILTER_STYLES.sectionSubtitle}>{subtitle}</p>}
        </div>
        {showCount && !isLoading && (
          <span className="text-sm text-gray-500">
            {count} {count === 1 ? 'item' : 'items'}
          </span>
        )}
        {isLoading && <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>}
      </div>
      {children}
    </div>
  );
}

export default FilterSection;
