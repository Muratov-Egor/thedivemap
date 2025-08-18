'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { MarkerProps } from '@/types/clustering';
import Button from '@/components/ui/Button';
import { CloseIcon } from '@/components/icons';

interface DiveSiteTooltipProps {
  site: MarkerProps['site'];
  onClose: (e: React.MouseEvent) => void;
}

const DiveSiteTooltip: React.FC<DiveSiteTooltipProps> = ({ site, onClose }) => {
  const { t } = useTranslation();

  // Форматирование координат
  const formatCoordinates = (lat: number, lng: number) => {
    const latStr = Math.abs(lat).toFixed(4) + (lat >= 0 ? '°N' : '°S');
    const lngStr = Math.abs(lng).toFixed(4) + (lng >= 0 ? '°E' : '°W');
    return `${latStr}, ${lngStr}`;
  };

  // Получение типа локации из данных API
  const getSiteTypeLabel = () => {
    if (site.site_type?.label_en && site.site_type?.label_ru) {
      // Используем label_ru для русского языка, label_en для английского
      const currentLang = document.documentElement.lang || 'ru';
      return currentLang === 'ru' ? site.site_type.label_ru : site.site_type.label_en;
    }
    return null; // Fallback если нет данных
  };

  return (
    <div
      data-testid={`dive-site-tooltip`}
      className={`
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
        px-3 py-2 rounded-lg text-sm whitespace-nowrap z-20
        bg-white/90 backdrop-blur-sm border border-white/20
        shadow-lg shadow-black/10
        transition-all duration-300 ease-out
        opacity-100 scale-100
      `}
    >
      <div
        data-testid={`dive-site-tooltip-name`}
        className="font-semibold text-gray-900 mb-1 text-center"
      >
        {site.name}
      </div>

      <div
        data-testid={`dive-site-tooltip-coordinates`}
        className="text-gray-600 text-xs mb-2 text-center"
      >
        📍 {formatCoordinates(site.latitude, site.longitude)}
      </div>

      <div className="flex justify-between gap-2">
        {getSiteTypeLabel() && (
          <div data-testid={`dive-site-tooltip-type`} className="text-gray-600 text-xs">
            {t('map.markers.type')}: {getSiteTypeLabel()}
          </div>
        )}

        {site.rating > 0 && (
          <div data-testid={`dive-site-tooltip-rating`} className="text-gray-600 text-xs">
            ⭐️ {site.rating}/5
          </div>
        )}
      </div>

      <Button
        onClick={onClose}
        variant="glass"
        shape="circle"
        size="small"
        icon={<CloseIcon className="w-2 h-2" />}
        className="!absolute !-top-2 !-right-2 !w-6 !h-6 !p-0"
        aria-label={t('map.markers.closeTooltip')}
        data-testid={`dive-site-tooltip-close`}
      />

      {/* Стрелка tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
    </div>
  );
};

export default DiveSiteTooltip;
