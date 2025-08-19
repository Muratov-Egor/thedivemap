'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { FiltersIcon } from '@/components/icons';
import { useFilters } from '@/hooks/useFilters';
import { useFiltersPanel } from '@/hooks/useFiltersPanel';
import { useIsMobile } from '@/hooks/useMediaQuery';
import FiltersLoader from './FiltersLoader';
import MobileFiltersPanel from './MobileFiltersPanel';
import FiltersContent from './FiltersContent';

export default function Filters() {
  const { t, i18n } = useTranslation('filters');
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const isMobile = useIsMobile();
  const { loading } = useFilters();
  const {
    depthValue,
    setDepthValue,
    visibilityValue,
    setVisibilityValue,
    handleAutocompleteSelect,
    handleClearAll,
    hasActiveFilters,
  } = useFiltersPanel();

  // Получаем текущий язык из i18n
  const currentLanguage = i18n.language as 'ru' | 'en';

  const toggleIsMobileFiltersPanelOpen = () => {
    setIsMobilePanelOpen(!isMobilePanelOpen);
  };

  return (
    <>
      {/* Десктопная версия - рендерим только на десктопе и когда мобильная панель закрыта */}
      {!isMobile && !isMobilePanelOpen && (
        <div
          className="flex flex-col justify-start items-center w-[500px] border-l border-gray-200 p-6 overflow-y-auto max-h-screen"
          data-testid="desktop-filters-panel"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6" suppressHydrationWarning>
            {t('title')}
          </h2>

          {loading ? (
            <FiltersLoader />
          ) : (
            <FiltersContent
              currentLanguage={currentLanguage}
              depthValue={depthValue}
              setDepthValue={setDepthValue}
              visibilityValue={visibilityValue}
              setVisibilityValue={setVisibilityValue}
              handleAutocompleteSelect={handleAutocompleteSelect}
              handleClearAll={handleClearAll}
              hasActiveFilters={hasActiveFilters}
            />
          )}
        </div>
      )}

      {/* Кнопка открытия мобильной панели - показываем только на мобильных */}
      {isMobile && !isMobilePanelOpen && (
        <div className="fixed bottom-6 right-6 z-50">
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
      )}

      {/* Мобильная панель фильтров */}
      {isMobilePanelOpen && <MobileFiltersPanel onClose={() => setIsMobilePanelOpen(false)} />}
    </>
  );
}
