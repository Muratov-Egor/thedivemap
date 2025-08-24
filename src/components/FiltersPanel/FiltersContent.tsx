import React from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '../ui/Autocomplete/Autocomplete';
import RatingFilters from './RatingFilters/RatingFilters';
import Slider from '../ui/Slider';
import Button from '@/components/ui/Button';
import SiteTypeFilter from './SiteTypeFilters/SiteTypeFilters';
import DifficultyFilter from './DifficultyFilters/DifficultyFilters';
import { AutocompleteItem } from '@/components/ui/Autocomplete/types';

interface FiltersContentProps {
  currentLanguage: 'ru' | 'en';
  depthValue: number;
  setDepthValue: (value: number) => void;
  visibilityValue: number;
  setVisibilityValue: (value: number) => void;
  handleAutocompleteSelect: (item: AutocompleteItem) => void;
  handleClearAll: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export default function FiltersContent({
  currentLanguage,
  depthValue,
  setDepthValue,
  visibilityValue,
  setVisibilityValue,
  handleAutocompleteSelect,
  handleClearAll,
  hasActiveFilters,
  className = '',
}: FiltersContentProps) {
  const { t } = useTranslation('filters');
  const { t: tCommon } = useTranslation('common');

  return (
    <div className={`space-y-6 w-full ${className}`} data-testid={'filters-content'}>
      <Autocomplete
        language={currentLanguage}
        placeholder={tCommon('search.placeholder')}
        onSelect={handleAutocompleteSelect}
      />
      <SiteTypeFilter />
      <DifficultyFilter />

      {/* Слайдеры фильтрации */}
      <div className="space-y-4">
        <Slider
          label={`${t('sliders.maxDepth')} (${t('units.meters')})`}
          min={0}
          max={50}
          step={1}
          value={depthValue}
          onChange={setDepthValue}
          valueSuffix={` ${t('units.meters')}`}
          variant="depth"
          dataTestId="max-depth-slider"
        />

        <Slider
          label={`${t('sliders.minVisibility')} (${t('units.meters')})`}
          min={0}
          max={30}
          step={0.5}
          value={visibilityValue}
          onChange={setVisibilityValue}
          valueSuffix={` ${t('units.meters')}`}
          variant="visibility"
          dataTestId="min-visibility-slider"
        />

        <RatingFilters />
      </div>

      {/* Общая кнопка очистки */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="coral"
            size="medium"
            onClick={handleClearAll}
            data-testid="clear-all-filters-button"
            className="w-full"
          >
            <span suppressHydrationWarning>{t('clearAll')}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
