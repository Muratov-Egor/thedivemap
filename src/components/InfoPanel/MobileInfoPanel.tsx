'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DiveSiteDetails } from '@/lib/types/supabase';
import { usePanel } from '@/contexts/PanelContext';
import { useDiveSiteDetails as useDiveSiteDetailsHook } from '@/hooks/useDiveSiteDetails';
import { useBodyOverflow } from '@/hooks/useBodyOverflow';
import Button from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons';
import InfoPanelContent from './InfoPanelContent';

interface MobileInfoPanelProps {
  diveSite?: DiveSiteDetails;
  onClose?: () => void;
  onDiveSiteUpdate?: () => void;
}

export default function MobileInfoPanel({
  diveSite: propDiveSite,
  onClose,
  onDiveSiteUpdate,
}: MobileInfoPanelProps) {
  const { t } = useTranslation('infoPanel');
  const { showFilters } = usePanel();
  const { diveSite: hookDiveSite, error } = useDiveSiteDetailsHook();

  // Используем данные из пропсов или из хука
  const diveSite = propDiveSite || hookDiveSite;

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

  const handleShowFilters = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showFilters();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      handleShowFilters({} as React.MouseEvent);
    }
  };

  if (error || !diveSite) {
    return (
      <div
        className="fixed inset-0 bg-background shadow-lg z-50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        data-testid="mobile-info-panel"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">{t('title')}</h2>
          <Button
            variant="secondary"
            shape="circle"
            size="small"
            icon={<CloseIcon />}
            onClick={handleClose}
            data-testid="close-info-panel-button"
            aria-label={t('backToFilters')}
          />
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-center text-slate-600 dark:text-slate-400">
            <p suppressHydrationWarning>{error || t('noData')}</p>
            <Button
              onClick={handleClose}
              variant="primary"
              size="medium"
              className="mt-6 shadow-simple hover:shadow-simple-hover"
            >
              <span suppressHydrationWarning>{t('backToFilters')}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-background shadow-lg z-50 flex flex-col"
      onClick={(e) => e.stopPropagation()}
      data-testid="mobile-info-panel"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <InfoPanelContent
            diveSite={diveSite}
            handleShowFilters={handleShowFilters}
            onDiveSiteUpdate={onDiveSiteUpdate}
          />
        </div>
      </div>
    </div>
  );
}
