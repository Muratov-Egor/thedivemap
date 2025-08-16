'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { FiltersIcon, CloseIcon } from '@/components/icons';
import Autocomplete from './ui/Autocomplete/Autocomplete';
import SiteTypeFilters from './ui/SiteTypeFilters';
import DifficultyFilters from './ui/DifficultyFilters';
import RatingFilters from './ui/RatingFilters';
import Slider from './ui/Slider';
import { useMap } from '@/contexts/MapContext';
import { useFilters } from '@/hooks/useFilters';
import { AutocompleteItem } from '@/components/ui/Autocomplete/types';
import { useDebounce } from '@/hooks/useDebounce';

export default function Filters() {
  const { t, i18n } = useTranslation('filters');
  const { t: tCommon } = useTranslation('common');
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const { loading } = useFilters();

  // Состояния для слайдеров
  const [depthValue, setDepthValue] = useState(50);
  const [visibilityValue, setVisibilityValue] = useState(0);

  // Debounce для предотвращения спама запросов
  const debouncedDepthValue = useDebounce(depthValue, 500);
  const debouncedVisibilityValue = useDebounce(visibilityValue, 500);

  const {
    centerOnSelection,
    activeFilters,
    clearFilters,
    setMaxDepthFilter,
    setMinVisibilityFilter,
  } = useMap();

  // Получаем текущий язык из i18n
  const currentLanguage = i18n.language as 'ru' | 'en';

  const toggleIsMobileFiltersPanelOpen = () => {
    setIsMobilePanelOpen(!isMobilePanelOpen);
  };

  const handleAutocompleteSelect = async (item: AutocompleteItem) => {
    // Центрируем карту на выбранном элементе
    await centerOnSelection(item);
  };

  const handleClearAll = () => {
    clearFilters();
    // Сбрасываем слайдеры к значениям по умолчанию
    setDepthValue(50);
    setVisibilityValue(0);
    // Явно сбрасываем фильтры глубины и видимости
    setMaxDepthFilter(null);
    setMinVisibilityFilter(null);
  };

  // Применяем debounced значения к фильтрам только если они отличаются от дефолтных
  useEffect(() => {
    if (debouncedDepthValue !== 50) {
      setMaxDepthFilter(debouncedDepthValue);
    } else {
      setMaxDepthFilter(null);
    }
  }, [debouncedDepthValue, setMaxDepthFilter]);

  useEffect(() => {
    if (debouncedVisibilityValue !== 0) {
      setMinVisibilityFilter(debouncedVisibilityValue);
    } else {
      setMinVisibilityFilter(null);
    }
  }, [debouncedVisibilityValue, setMinVisibilityFilter]);

  // Синхронизируем локальные состояния с активными фильтрами
  useEffect(() => {
    if (activeFilters.maxDepth === null) {
      setDepthValue(50); // Значение по умолчанию
    }
  }, [activeFilters.maxDepth]);

  useEffect(() => {
    if (activeFilters.minVisibility === null) {
      setVisibilityValue(0); // Значение по умолчанию
    }
  }, [activeFilters.minVisibility]);

  const hasActiveFilters =
    activeFilters.siteTypeIds.length > 0 ||
    activeFilters.difficultyIds.length > 0 ||
    (activeFilters.maxDepth !== null && activeFilters.maxDepth !== 50) ||
    (activeFilters.minVisibility !== null && activeFilters.minVisibility !== 0) ||
    activeFilters.minRating !== null;

  // Компонент общего лоадера для всех фильтров
  const FiltersLoader = () => (
    <div className="space-y-6 w-full">
      {/* Лоадер для автокомплита */}
      <div className="space-y-3">
        <div className="animate-pulse bg-gray-200 h-12 w-full rounded-lg"></div>
      </div>

      {/* Лоадер для типа дайв-сайта */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-8 w-24 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Лоадер для уровня сложности */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-8 w-28 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Лоадер для слайдеров */}
      <div className="space-y-4">
        {/* Лоадер для слайдера глубины */}
        <div className="space-y-3">
          <div className="animate-pulse bg-gray-200 h-4 w-48 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-6 w-full rounded"></div>
          <div className="flex justify-between">
            <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
          </div>
        </div>

        {/* Лоадер для слайдера видимости */}
        <div className="space-y-3">
          <div className="animate-pulse bg-gray-200 h-4 w-52 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-6 w-full rounded"></div>
          <div className="flex justify-between">
            <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
          </div>
        </div>

        {/* Лоадер для рейтинга */}
        <div className="space-y-3">
          <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-6 w-6 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Десктопная версия */}
      <div
        className="hidden md:flex flex-col justify-start items-center md:w-[500px] border-l border-gray-200 p-6 overflow-y-auto max-h-screen"
        data-testid="desktop-filters-panel"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t('title')}</h2>

        {loading ? (
          <FiltersLoader />
        ) : (
          <div className="space-y-6 w-full">
            <Autocomplete
              language={currentLanguage}
              placeholder={tCommon('search.placeholder')}
              onSelect={handleAutocompleteSelect}
            />
            <SiteTypeFilters />
            <DifficultyFilters />

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
                variant="default"
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
                variant="ocean"
                dataTestId="min-visibility-slider"
              />

              <RatingFilters />
            </div>

            {/* Общая кнопка очистки */}
            {hasActiveFilters && (
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="coral"
                  size="medium"
                  onClick={handleClearAll}
                  data-testid="clear-all-filters-button"
                  className="w-full"
                >
                  {t('clearAll')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button
          variant="coral"
          shape="circle"
          size="medium"
          icon={<FiltersIcon />}
          onClick={toggleIsMobileFiltersPanelOpen}
          data-testid="open-filters-panel-button"
          aria-label={t('accessibility.openFilters')}
        />
      </div>

      {/* Мобильная панель фильтров */}
      {isMobilePanelOpen && (
        <div
          className="absolute right-0 top-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col"
          onClick={(e) => e.stopPropagation()}
          data-testid="mobile-filters-panel"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">{t('title')}</h2>
            <Button
              variant="ghost"
              shape="circle"
              size="small"
              icon={<CloseIcon />}
              onClick={() => setIsMobilePanelOpen(false)}
              data-testid="close-filters-panel-button"
              aria-label={t('accessibility.closeFilters')}
            />
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <FiltersLoader />
            ) : (
              <div className="space-y-6">
                <Autocomplete
                  language={currentLanguage}
                  placeholder={tCommon('search.placeholder')}
                  onSelect={handleAutocompleteSelect}
                />
                <SiteTypeFilters />
                <DifficultyFilters />

                {/* Слайдеры фильтрации для мобильной версии */}
                <div className="space-y-4">
                  <Slider
                    label={`${t('sliders.maxDepth')} (${t('units.meters')})`}
                    min={0}
                    max={50}
                    step={1}
                    value={depthValue}
                    onChange={setDepthValue}
                    valueSuffix={` ${t('units.meters')}`}
                    variant="default"
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
                    variant="ocean"
                    dataTestId="min-visibility-slider"
                  />

                  <RatingFilters />
                </div>

                {/* Общая кнопка очистки для мобильной версии */}
                {hasActiveFilters && (
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      variant="coral"
                      size="medium"
                      onClick={handleClearAll}
                      data-testid="clear-all-filters-button-mobile"
                      className="w-full"
                    >
                      {t('clearAll')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
