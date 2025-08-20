'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DiveSiteDetails } from '@/lib/types/supabase';
import { usePanel } from '@/contexts/PanelContext';
import { useDiveSiteDetails as useDiveSiteDetailsHook } from '@/hooks/useDiveSiteDetails';
import Button from '@/components/ui/Button';
import InfoPanelContent from './InfoPanelContent';
import { useIsMobile } from '@/hooks/useMediaQuery';
import MobileInfoPanel from './MobileInfoPanel';

interface InfoPanelProps {
  diveSite?: DiveSiteDetails;
}

export default function InfoPanel({ diveSite: propDiveSite }: InfoPanelProps) {
  const { t } = useTranslation('infoPanel');
  const { showFilters } = usePanel();
  const { diveSite: hookDiveSite, error } = useDiveSiteDetailsHook();
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleIsMobileFiltersPanelOpen = () => {
    setIsMobilePanelOpen(!isMobilePanelOpen);
  };

  // Используем данные из пропсов или из хука
  const diveSite = propDiveSite || hookDiveSite;

  const handleShowFilters = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showFilters();
  };

  if (error || !diveSite) {
    return (
      <div
        className="flex flex-col justify-start items-center w-[500px] border-l border-slate-200 bg-white/80 backdrop-blur-xl p-6 h-full max-h-[calc(100vh-4rem)] sm:max-h-full"
        data-testid="desktop-info-panel"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-6" suppressHydrationWarning>
          {t('title')}
        </h2>
        <div className="text-center text-slate-600">
          <p suppressHydrationWarning>{error || t('noData')}</p>
          <Button
            onClick={handleShowFilters}
            variant="primary"
            size="medium"
            className="mt-6 shadow-glow hover:shadow-glow-hover"
          >
            <span suppressHydrationWarning>{t('backToFilters')}</span>
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (isMobile && diveSite && !isMobilePanelOpen) {
      setIsMobilePanelOpen(true);
    }
  }, [isMobile, diveSite, isMobilePanelOpen]);

  return (
    <>
      {!isMobile && !isMobilePanelOpen && (
        <div
          className="flex flex-col justify-start items-center w-[600px] border-l border-slate-200 bg-white/80 backdrop-blur-xl p-6 overflow-y-auto h-full max-h-[calc(100vh-4rem)] sm:max-h-full z-[60]"
          data-testid="desktop-info-panel"
        >
          <InfoPanelContent diveSite={diveSite} handleShowFilters={handleShowFilters} />
        </div>
      )}
      {isMobile && isMobilePanelOpen && (
        <MobileInfoPanel diveSite={diveSite} onClose={() => setIsMobilePanelOpen(false)} />
      )}
    </>
  );
}
