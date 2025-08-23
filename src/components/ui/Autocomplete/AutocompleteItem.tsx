'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AutocompleteItem as AutocompleteItemType } from './types';
import { cn, getCountryFlag } from '@/lib/utils';
import { MaskIcon, TagIcon, MapIcon } from '@/components/icons';

interface AutocompleteItemProps {
  item: AutocompleteItemType;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  index: number; // Добавляем индекс для ID
}

//todo вынести в отдельный компонент
const getTypeIcon = (
  type: AutocompleteItemType['type'],
  metadata?: Record<string, string | number | boolean | string[]>,
) => {
  switch (type) {
    case 'country':
      // Используем флаг страны если есть ISO код
      const isoCode = metadata?.iso_code as string;
      return isoCode ? getCountryFlag(isoCode) : '🌍';
    case 'region':
      return <MapIcon size={16} scale={200} />;
    case 'location':
      return <TagIcon size={16} scale={200} />;
    default:
      return <MaskIcon size={16} scale={200} />;
  }
};

export default function AutocompleteItem({
  item,
  isSelected,
  onClick,
  className,
  index,
}: AutocompleteItemProps) {
  const { t } = useTranslation('autocomplete');

  //todo вынести в отдельный компонент
  const getTypeLabel = (type: AutocompleteItemType['type']) => {
    switch (type) {
      case 'site':
        return t('types.site');
      case 'country':
        return t('types.country');
      case 'region':
        return t('types.region');
      case 'location':
        return t('types.location');
      default:
        return t('types.result');
    }
  };

  return (
    <div
      id={`autocomplete-option-${index}`}
      className={cn(
        'relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 ease-in-out',
        'hover:bg-gradient-to-r hover:from-tropical-blue/5 hover:to-deep-ocean/5 dark:hover:from-blue-400/10 dark:hover:to-blue-600/10',
        'focus:bg-gradient-to-r focus:from-tropical-blue/10 focus:to-deep-ocean/10 dark:focus:from-blue-400/20 dark:focus:to-blue-600/20',
        'focus:outline-none focus:ring-2 focus:ring-tropical-blue/20 dark:focus:ring-blue-400/30',
        isSelected &&
          'bg-gradient-to-r from-tropical-blue/10 to-deep-ocean/10 dark:from-blue-400/20 dark:to-blue-600/20',
        'border-b border-slate-100 dark:border-slate-700 last:border-b-0',
        className,
      )}
      onClick={onClick}
      role="option"
      aria-selected={isSelected}
      aria-label={`${item.name}, ${getTypeLabel(item.type)}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      data-testid="autocomplete-item"
    >
      {/* Type Icon */}
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg">
        {getTypeIcon(item.type, item.metadata)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Main Name */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium text-slate-800 dark:text-slate-200 truncate',
              isSelected && 'text-tropical-blue dark:text-blue-400',
            )}
            data-testid="autocomplete-item-name"
          >
            {item.name}
          </span>
          <span
            className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full"
            data-testid="autocomplete-item-type"
          >
            {getTypeLabel(item.type)}
          </span>
        </div>

        {/* Additional Metadata */}
        {item.metadata && Object.keys(item.metadata).length > 0 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {item.type === 'site' && item.metadata.site_type && (
              <span className="inline-block bg-coral/10 text-coral px-2 py-1 rounded mr-2">
                {item.metadata.site_type}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div
          className="flex-shrink-0 w-2 h-2 bg-tropical-blue rounded-full"
          data-testid="autocomplete-item-selected"
        />
      )}
    </div>
  );
}
