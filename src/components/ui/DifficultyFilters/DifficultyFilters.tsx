'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from '@/contexts/MapContext';
import { useFilters } from '@/hooks/useFilters';
import Chip from '../Chip/Chip';

export default function DifficultyFilters() {
  const { t } = useTranslation('filters');
  const { activeFilters, setDifficultyFilter } = useMap();
  const { filters, loading } = useFilters();

  const handleDifficultyClick = (difficultyId: number) => {
    setDifficultyFilter(difficultyId);
  };

  if (loading || !filters) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">{t('difficulties.title')}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-8 w-20 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{t('difficulties.title')}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.difficulties.map((difficulty) => (
          <Chip
            key={difficulty.id}
            selected={activeFilters.difficultyIds.includes(difficulty.id)}
            onClick={() => handleDifficultyClick(difficulty.id)}
            data-testid={`difficulty-filter-${difficulty.id}`}
            aria-label={`${t('difficulties.filterBy')} ${difficulty.label}`}
          >
            {difficulty.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
