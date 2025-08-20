import React, { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { CloseIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { useFilters } from '@/hooks/useFilters';
import { useFiltersPanel } from '@/hooks/useFiltersPanel';
import { useBodyOverflow } from '@/hooks/useBodyOverflow';
import FiltersLoader from './FiltersLoader';
import FiltersContent from './FiltersContent';

interface MobileFiltersPanelProps {
  onClose: () => void;
}

export default function MobileFiltersPanel({ onClose }: MobileFiltersPanelProps) {
  const { t, i18n } = useTranslation('filters');
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

  const currentLanguage = i18n.language as 'ru' | 'en';

  // Управляем overflow body и закрываем tooltip'ы при открытии панели
  useBodyOverflow(true);

  // Закрываем все открытые tooltip'ы при открытии мобильной панели
  useEffect(() => {
    // Находим и закрываем все открытые tooltip'ы
    const tooltips = document.querySelectorAll('[data-testid*="dive-site-tooltip"]');
    tooltips.forEach((tooltip) => {
      const closeButton = tooltip.querySelector(
        '[data-testid*="dive-site-tooltip-close"]',
      ) as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    });
  }, []);

  return (
    <div
      className="fixed inset-0 bg-white shadow-lg z-50 flex flex-col"
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
          onClick={onClose}
          data-testid="close-filters-panel-button"
          aria-label={t('accessibility.closeFilters')}
        />
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
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
    </div>
  );
}
