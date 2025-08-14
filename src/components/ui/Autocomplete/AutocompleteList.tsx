'use client';

import React from 'react';
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
  if (isLoading) {
    return (
      <div
        className={cn(
          'absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-lg z-50',
          'max-h-80 overflow-hidden',
          className
        )}
      >
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-tropical-blue"></div>
            <span className="text-sm font-medium">Поиск...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-xl border border-red-200 rounded-2xl shadow-lg z-50',
          'max-h-80 overflow-hidden',
          className
        )}
      >
        <div className="flex items-center justify-center py-6 px-4">
          <div className="flex items-center gap-3 text-red-600">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">Ошибка поиска</div>
              <div className="text-red-500">{error}</div>
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
      className={cn(
        'absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-lg z-50',
        'max-h-80 overflow-y-auto',
        'scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent',
        className
      )}
      role="listbox"
      aria-label="Результаты поиска"
    >
      {results.map((item, index) => (
        <AutocompleteItem
          key={`${item.type}-${item.id}`}
          item={item}
          isSelected={index === selectedIndex}
          onClick={() => onSelect(item)}
        />
      ))}

      {/* Results count indicator */}
      <div className="px-4 py-2 text-xs text-slate-500 border-t border-slate-100 bg-slate-50/50">
        Найдено результатов: {results.length}
      </div>
    </div>
  );
}
