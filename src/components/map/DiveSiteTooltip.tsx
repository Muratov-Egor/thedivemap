'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { MarkerProps } from '@/types/clustering';
import Button from '@/components/ui/Button';
import { CloseIcon, SiteTypeIcon, VisibilityIcon, DepthIcon, MarkIcon } from '@/components/icons';
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
        bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600
        shadow-simple hover:shadow-simple-hover
        transition-all duration-300 ease-out
        min-w-[280px] max-w-[320px]
        pointer-events-auto
      `}
      style={{
        // Предотвращаем выход за границы viewport
        maxWidth: 'calc(100vw - 2rem)',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Заголовок */}
      <div
        data-testid={`dive-site-tooltip-name`}
        className="font-semibold text-foreground mb-3 text-center text-xl"
      >
        {site.name}
      </div>

      {/* Координаты */}
      <div
        data-testid={`dive-site-tooltip-coordinates`}
        className="text-slate-600 dark:text-slate-400 text-xs mb-3 text-center flex items-center justify-center gap-1"
      >
        <MarkIcon size={14} scale={200} />
        {formatCoordinates(site.latitude, site.longitude)}
      </div>

      {/* Тип, глубина и видимость */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {getSiteTypeLabel() && (
          <div
            data-testid={`dive-site-tooltip-type`}
            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium"
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
          className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium"
        >
          <DepthIcon size={16} withBackground scale={200} />
          <span className="flex items-center">
            {site.depth_max} {t('map.markers.meters')}
          </span>
        </div>

        <div
          data-testid={`dive-site-tooltip-visibility`}
          className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium"
        >
          <VisibilityIcon size={16} withBackground scale={200} />
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

      {/* Кнопка закрытия - ИСПРАВЛЕНО */}
      <button
        onClick={onClose}
        className="
          absolute -top-2 -right-2 w-7 h-7 p-0 
          bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600
          border-2 border-slate-300 dark:border-slate-500
          rounded-full shadow-simple hover:shadow-simple-hover
          transition-all duration-300 ease-out
          flex items-center justify-center
          text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-primary-action/50 focus:ring-offset-1
          active:scale-95 transform hover:-translate-y-0.5
        "
        aria-label={t('map.markers.closeTooltip')}
        data-testid={`dive-site-tooltip-close`}
      >
        <CloseIcon className="w-3 h-3" />
      </button>

      {/* Стрелка tooltip - ИСПРАВЛЕНО */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white dark:border-t-slate-800"></div>
    </div>
  );
};

export default DiveSiteTooltip;
