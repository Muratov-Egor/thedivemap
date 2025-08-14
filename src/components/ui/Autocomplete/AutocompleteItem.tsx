'use client';

import React from 'react';
import { AutocompleteItem as AutocompleteItemType } from './types';
import { cn } from '@/lib/utils';

interface AutocompleteItemProps {
  item: AutocompleteItemType;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

const getTypeIcon = (type: AutocompleteItemType['type']) => {
  switch (type) {
    case 'site':
      return '🏊‍♂️';
    case 'country':
      return '🌍';
    case 'region':
      return '🗺️';
    case 'location':
      return '📍';
    default:
      return '🔍';
  }
};

const getTypeLabel = (type: AutocompleteItemType['type']) => {
  switch (type) {
    case 'site':
      return 'Место для дайвинга';
    case 'country':
      return 'Страна';
    case 'region':
      return 'Регион';
    case 'location':
      return 'Локация';
    default:
      return 'Результат';
  }
};

export default function AutocompleteItem({
  item,
  isSelected,
  onClick,
  className,
}: AutocompleteItemProps) {
  return (
    <div
      className={cn(
        'relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 ease-in-out',
        'hover:bg-gradient-to-r hover:from-tropical-blue/5 hover:to-deep-ocean/5',
        'focus:bg-gradient-to-r focus:from-tropical-blue/10 focus:to-deep-ocean/10',
        'focus:outline-none focus:ring-2 focus:ring-tropical-blue/20',
        isSelected && 'bg-gradient-to-r from-tropical-blue/10 to-deep-ocean/10',
        'border-b border-slate-100 last:border-b-0',
        className
      )}
      onClick={onClick}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Type Icon */}
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg">
        {getTypeIcon(item.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Main Name */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium text-slate-800 truncate',
              isSelected && 'text-tropical-blue'
            )}
          >
            {item.name}
          </span>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {getTypeLabel(item.type)}
          </span>
        </div>

        {/* Subtitle */}
        {item.subtitle && (
          <div className="text-sm text-slate-600 truncate mt-1">
            {item.subtitle}
          </div>
        )}

        {/* Additional Metadata */}
        {item.metadata && Object.keys(item.metadata).length > 0 && (
          <div className="text-xs text-slate-500 mt-1">
            {item.type === 'site' && item.metadata.site_type && (
              <span className="inline-block bg-coral/10 text-coral px-2 py-1 rounded mr-2">
                {item.metadata.site_type}
              </span>
            )}
            {item.type === 'country' && item.metadata.iso_code && (
              <span className="inline-block bg-deep-ocean/10 text-deep-ocean px-2 py-1 rounded">
                {item.metadata.iso_code}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="flex-shrink-0 w-2 h-2 bg-tropical-blue rounded-full" />
      )}
    </div>
  );
}
