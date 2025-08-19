'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { MarkerProps } from '@/types/clustering';
import Button from '@/components/ui/Button';
import { CloseIcon, SiteTypeIcon } from '@/components/icons';
import { formatCoordinates } from '@/lib/utils';

interface DiveSiteTooltipProps {
  site: MarkerProps['site'];
  onClose: (e: React.MouseEvent) => void;
  onShowDetails?: (siteId: string) => void;
}

const DiveSiteTooltip: React.FC<DiveSiteTooltipProps> = ({ site, onClose, onShowDetails }) => {
  const { t } = useTranslation();

  // Получение типа локации из данных API
  const getSiteTypeLabel = () => {
    if (site.site_type?.label_en && site.site_type?.label_ru) {
      // Используем label_ru для русского языка, label_en для английского
      const currentLang = document.documentElement.lang || 'ru';
      return currentLang === 'ru' ? site.site_type.label_ru : site.site_type.label_en;
    }
    return null; // Fallback если нет данных
  };

  const handleShowDetails = () => {
    if (onShowDetails) {
      onShowDetails(site.id);
    }
  };

  return (
    <div
      data-testid={`dive-site-tooltip`}
      className={`
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 
        px-4 py-3 rounded-2xl text-sm z-20
        bg-white backdrop-blur-lg border border-tropical-blue/20
        shadow-glass hover:shadow-glass-hover
        transition-all duration-300 ease-out
        min-w-[280px] max-w-[320px]
      `}
    >
      {/* Заголовок */}
      <div
        data-testid={`dive-site-tooltip-name`}
        className="font-semibold text-gray-900 mb-2 text-center text-base"
      >
        {site.name}
      </div>

      {/* Координаты */}
      <div
        data-testid={`dive-site-tooltip-coordinates`}
        className="text-gray-600 text-xs mb-3 text-center flex items-center justify-center gap-1"
      >
        <span className="text-tropical-blue flex items-center">📍</span>
        {formatCoordinates(site.latitude, site.longitude)}
      </div>

      {/* Тип, глубина и видимость */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {getSiteTypeLabel() && (
          <div
            data-testid={`dive-site-tooltip-type`}
            className="flex items-center gap-2 text-gray-700 text-sm font-medium"
          >
            <SiteTypeIcon
              siteTypeId={site.site_type?.id || 12}
              className="w-4 h-4 flex-shrink-0 flex items-center justify-center"
            />
            <span className="flex items-center">{getSiteTypeLabel()}</span>
          </div>
        )}

        <div
          data-testid={`dive-site-tooltip-depth`}
          className="flex items-center gap-2 text-gray-700 text-sm font-medium"
        >
          <span className="text-tropical-blue flex items-center justify-center">⬇</span>
          <span className="flex items-center">
            {site.depth_max} {t('map.markers.meters')}
          </span>
        </div>

        <div
          data-testid={`dive-site-tooltip-visibility`}
          className="flex items-center gap-2 text-gray-700 text-sm font-medium"
        >
          <span className="text-tropical-blue flex items-center justify-center">👁️</span>
          <span className="flex items-center">
            {site.visibility} {t('map.markers.meters')}
          </span>
        </div>
      </div>

      {/* Кнопка "Подробнее" */}
      <div className="flex justify-center !mt-5">
        <Button
          onClick={handleShowDetails}
          variant="primary"
          size="small"
          className="justify-center"
          aria-label={t('map.markers.more')}
          data-testid="dive-site-tooltip-more-button"
        >
          {t('map.markers.more')}
        </Button>
      </div>

      {/* Кнопка закрытия */}
      <Button
        onClick={onClose}
        variant="glass"
        shape="circle"
        size="small"
        icon={<CloseIcon className="w-3 h-3" />}
        className="!absolute !-top-2 !-right-2 !w-7 !h-7 !p-0 shadow-md"
        aria-label={t('map.markers.closeTooltip')}
        data-testid={`dive-site-tooltip-close`}
      />

      {/* Стрелка tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/85"></div>
    </div>
  );
};

export default DiveSiteTooltip;
