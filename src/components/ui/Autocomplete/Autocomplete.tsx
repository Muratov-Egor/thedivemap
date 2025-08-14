'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AutocompleteProps } from './types';
import { useAutocomplete } from './useAutocomplete';
import AutocompleteList from './AutocompleteList';
import { cn } from '@/lib/utils';

export default function Autocomplete({
  placeholder,
  className,
  onSelect,
  onSearch,
  debounceMs = 300,
  minQueryLength = 2,
  maxResults = 10,
  disabled = false,
  loading = false,
  error = null,
  language = 'ru', // Добавляем параметр языка с дефолтным значением
}: AutocompleteProps) {
  const { t } = useTranslation('autocomplete');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Используем переданный placeholder или дефолтный из i18n
  const defaultPlaceholder = t('placeholder');

  const { state, actions } = useAutocomplete(
    onSelect,
    debounceMs,
    minQueryLength,
    maxResults,
    language
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          actions.navigateDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          actions.navigateUp();
          break;
        case 'Enter':
          e.preventDefault();
          if (state.selectedIndex >= 0 && state.results[state.selectedIndex]) {
            actions.selectItem(state.results[state.selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          actions.closeDropdown();
          inputRef.current?.blur();
          break;
        case 'Tab':
          actions.closeDropdown();
          break;
      }
    },
    [actions, state.selectedIndex, state.results]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      actions.setQuery(value);
      onSearch?.(value);
    },
    [actions, onSearch]
  );

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    if (state.results.length > 0) {
      actions.openDropdown();
    }
  }, [actions, state.results.length]);

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    // Delay closing to allow for clicks on dropdown items
    setTimeout(() => {
      actions.closeDropdown();
    }, 150);
  }, [actions]);

  // Handle clear button click
  const handleClear = useCallback(() => {
    actions.setQuery('');
    actions.clearResults();
    inputRef.current?.focus();
  }, [actions]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        actions.closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actions]);

  // Auto-focus selected item in dropdown
  useEffect(() => {
    if (state.selectedIndex >= 0 && state.isOpen) {
      const selectedElement = containerRef.current?.querySelector(
        `[data-index="${state.selectedIndex}"]`
      );
      if (selectedElement) {
        (selectedElement as HTMLElement).scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [state.selectedIndex, state.isOpen]);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      role="combobox"
      aria-expanded={state.isOpen}
      aria-haspopup="listbox"
      aria-controls="autocomplete-listbox"
    >
      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={state.query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder || defaultPlaceholder}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 text-base text-slate-800 placeholder-slate-500',
            'bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl',
            'focus:border-tropical-blue focus:outline-none focus:ring-2 focus:ring-tropical-blue/20',
            'transition-all duration-300 ease-in-out',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'pr-12', // Space for clear button
            state.isOpen && 'border-tropical-blue shadow-lg',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
          )}
          aria-autocomplete="list"
          aria-controls="autocomplete-listbox"
          aria-activedescendant={
            state.selectedIndex >= 0
              ? `autocomplete-option-${state.selectedIndex}`
              : undefined
          }
        />

        {/* Loading Indicator */}
        {(state.isLoading || loading) && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-tropical-blue"></div>
          </div>
        )}

        {/* Clear Button */}
        {state.query && !state.isLoading && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={t('clearButton')}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Search Icon */}
        {!state.query && !state.isLoading && !loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown List */}
      {(state.isOpen || state.isLoading || error) && (
        <AutocompleteList
          results={state.results}
          selectedIndex={state.selectedIndex}
          onSelect={actions.selectItem}
          isLoading={state.isLoading || loading}
          error={error || state.error}
        />
      )}

      {/* Error Message */}
      {error && !state.isOpen && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
