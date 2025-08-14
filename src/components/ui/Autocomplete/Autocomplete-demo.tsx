'use client';

import React, { useState } from 'react';
import { Autocomplete } from './index';
import type { AutocompleteItem } from './types';

export default function AutocompleteDemo() {
  const [selectedItem, setSelectedItem] = useState<AutocompleteItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (item: AutocompleteItem) => {
    setSelectedItem(item);
    console.log('Selected item:', item);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search query:', query);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Автокомплит Демо
        </h1>
        <p className="text-slate-600">
          Поиск мест для дайвинга, стран, регионов и локаций
        </p>
      </div>

      <div className="space-y-4">
        <Autocomplete
          placeholder="Начните вводить название места, страны или региона..."
          onSelect={handleSelect}
          onSearch={handleSearch}
          className="w-full"
        />

        {/* Selected Item Display */}
        {selectedItem && (
          <div className="mt-6 p-4 bg-gradient-to-r from-tropical-blue/5 to-deep-ocean/5 rounded-2xl border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Выбранный элемент:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(selectedItem.type)}</span>
                <span className="font-medium text-slate-800">{selectedItem.name}</span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {getTypeLabel(selectedItem.type)}
                </span>
              </div>
              {selectedItem.subtitle && (
                <div className="text-sm text-slate-600">{selectedItem.subtitle}</div>
              )}
              {selectedItem.metadata && Object.keys(selectedItem.metadata).length > 0 && (
                <div className="text-xs text-slate-500">
                  <pre className="bg-slate-100 p-2 rounded overflow-auto">
                    {JSON.stringify(selectedItem.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Query Display */}
        {searchQuery && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">
              Поисковый запрос: <span className="font-medium">{searchQuery}</span>
            </span>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Инструкции:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Начните вводить текст для поиска (минимум 2 символа)</li>
          <li>• Используйте стрелки ↑↓ для навигации по результатам</li>
          <li>• Нажмите Enter для выбора элемента</li>
          <li>• Нажмите Escape для закрытия выпадающего списка</li>
          <li>• Кликните на элемент для выбора</li>
        </ul>
      </div>
    </div>
  );
}

const getTypeIcon = (type: AutocompleteItem['type']) => {
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

const getTypeLabel = (type: AutocompleteItem['type']) => {
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
