'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AutocompleteItem as AutocompleteItemType } from './types';
import AutocompleteItem from './AutocompleteItem';
import { cn } from '@/lib/utils';

interface AutocompleteListProps {
  results: AutocompleteItemType[];
  selectedIndex: number;
  onSelect: (item: AutocompleteItemType) => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export default function AutocompleteList({
  results,
  selectedIndex,
  onSelect,
  isLoading = false,
  error = null,
  className,
}: AutocompleteListProps) {
  const { t } = useTranslation('autocomplete');

  if (isLoading) {
    return (
      <div
        className={cn(
          'absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-lg z-50',
          'max-h-80 overflow-hidden',
          className,
        )}
        data-testid="autocomplete-list-loading"
      >
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-action"></div>
            <span className="text-sm font-medium">{t('loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-danger-accent/30 dark:border-danger-accent/50 rounded-2xl shadow-lg z-50',
          'max-h-80 overflow-hidden',
          className,
        )}
        data-testid="autocomplete-list-error"
      >
        <div className="flex items-center justify-center py-6 px-4">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">{t('errors.searchFailed')}</div>
              <div className="text-red-500 dark:text-red-400">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div
      id="autocomplete-listbox"
              className={cn(
          'absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-lg z-50',
          'max-h-120 overflow-y-auto',
          'scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent',
          className,
        )}
      role="listbox"
      aria-label={t('resultsLabel')}
      data-testid="autocomplete-list"
    >
      {results.map((item, index) => (
        <AutocompleteItem
          key={`${item.type}-${item.id}`}
          item={item}
          isSelected={index === selectedIndex}
          onClick={() => onSelect(item)}
          index={index}
        />
      ))}

      {/* Results count indicator */}
      <div
        className="px-4 py-2 text-xs bg-blue-100 bg-opacity-50 text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
        data-testid="autocomplete-list-results-count"
        aria-live="polite"
        aria-label={`${t('resultsCount')}: ${results.length}`}
      >
        {t('resultsCount')}: {results.length}
      </div>
    </div>
  );
}
