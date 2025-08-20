'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from '@/contexts/MapContext';
import { cn } from '@/lib/utils';

interface RatingFiltersProps {
  className?: string;
}

export default function RatingFilters({ className }: RatingFiltersProps) {
  const { t } = useTranslation('filters');
  const { activeFilters, setMinRatingFilter } = useMap();

  const handleRatingClick = (rating: number) => {
    // Если выбран тот же рейтинг, сбрасываем фильтр (показываем все)
    if (activeFilters.minRating === rating) {
      setMinRatingFilter(null);
    } else {
      setMinRatingFilter(rating);
    }
  };

  const renderStar = (starNumber: number, isSelected: boolean, isActive: boolean) => {
    return (
      <button
        key={starNumber}
        onClick={() => handleRatingClick(starNumber)}
        className={cn(
          'transition-all duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-coral-reef focus:ring-offset-1',
          'w-10 h-10 flex items-center justify-center',
          isSelected && 'text-yellow-400',
          !isSelected && isActive && 'text-yellow-400',
          !isSelected && !isActive && 'text-gray-300 hover:text-yellow-400',
        )}
        data-testid={`rating-star-${starNumber}`}
        aria-label={`${t('rating.filterBy')} ${starNumber} ${starNumber === 1 ? t('rating.star') : t('rating.stars')}`}
        suppressHydrationWarning
      >
        <svg
          className="w-full h-full fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>
    );
  };

  return (
    <div className={cn('space-y-3', className)} data-testid="rating-filters">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
          suppressHydrationWarning
        >
          {t('rating.title')}
        </h3>
        {activeFilters.minRating && (
          <span className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>
            {t('rating.minimum')} {activeFilters.minRating}+
          </span>
        )}
      </div>

      <div className="flex items-center justify-between px-6">
        {[1, 2, 3, 4, 5].map((starNumber) => {
          const isSelected = activeFilters.minRating === starNumber;
          const isActive = activeFilters.minRating ? starNumber <= activeFilters.minRating : false;

          return renderStar(starNumber, isSelected, isActive);
        })}
      </div>
    </div>
  );
}
