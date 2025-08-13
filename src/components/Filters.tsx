'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { FiltersIcon, CloseIcon } from '@/components/icons';

export default function Filters() {
  const { t } = useTranslation('filters');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileFilters = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Десктопная версия */}
      <div
        className="hidden md:flex flex-col justify-start items-center md:w-[500px] border-l border-gray-200 p-6 overflow-y-auto max-h-screen"
        data-testid="desktop-filters-panel"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t('title')}</h2>
      </div>

      {!isMobileOpen && (
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <Button
            variant="coral"
            shape="circle"
            size="medium"
            icon={<FiltersIcon />}
            onClick={toggleMobileFilters}
            data-testid="open-filters-panel-button"
            aria-label={t('accessibility.openFilters')}
          />
        </div>
      )}

      {/* Мобильная панель фильтров */}
      {isMobileOpen && (
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
              onClick={() => setIsMobileOpen(false)}
              data-testid="close-button"
              aria-label={t('accessibility.closeFilters')}
            />
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <p className="text-gray-600">{t('stub')}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
