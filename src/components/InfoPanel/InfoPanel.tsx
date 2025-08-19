'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { DiveSiteDetails } from '@/lib/types/supabase';
import { usePanel } from '@/contexts/PanelContext';
import { useDiveSiteDetails as useDiveSiteDetailsHook } from '@/hooks/useDiveSiteDetails';
import Button from '@/components/ui/Button';
import { CloseIcon, SiteTypeIcon } from '@/components/icons';
import { ImageGallery } from '@/components/ui';
import { formatCoordinates, getCountryFlag } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface InfoPanelProps {
  diveSite?: DiveSiteDetails;
}

export default function InfoPanel({ diveSite: propDiveSite }: InfoPanelProps) {
  const { t } = useTranslation('infoPanel');
  const { showFilters } = usePanel();
  const { diveSite: hookDiveSite, error } = useDiveSiteDetailsHook();

  // Используем данные из пропсов или из хука
  const diveSite = propDiveSite || hookDiveSite;

  const handleShowFilters = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showFilters();
  };

  // Получение локализованного названия
  const getLocalizedName = (nameEn: string, nameRu: string) => {
    const currentLang = document.documentElement.lang || 'ru';
    return currentLang === 'ru' ? nameRu : nameEn;
  };

  if (error || !diveSite) {
    return (
      <div
        className="flex flex-col justify-start items-center w-[500px] border-l border-slate-200 bg-white/80 backdrop-blur-xl p-6 overflow-y-auto max-h-screen"
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

  return (
    <div
      className="flex flex-col justify-start items-center w-[500px] border-l border-slate-200 bg-white/80 backdrop-blur-xl p-6 overflow-y-auto max-h-screen"
      data-testid="desktop-info-panel"
    >
      {/* Заголовок с кнопкой возврата */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800" suppressHydrationWarning>
            {getCountryFlag(diveSite.country.iso_code)} {diveSite.name}
          </h2>

          <Button
            onClick={handleShowFilters}
            variant="glass"
            size="small"
            shape="circle"
            aria-label={t('backToFilters')}
            className="shadow-glass hover:shadow-glass-hover"
          >
            <CloseIcon />
          </Button>
        </div>
        {/* Координаты и местоположение */}
        <div className="flex items-center gap-4 mt-3 text-slate-600 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-tropical-blue text-lg">📍</span>
            <span className="font-medium">
              {formatCoordinates(diveSite.latitude, diveSite.longitude)}
            </span>
          </div>
          {diveSite.country && (
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCountryFlag(diveSite.country.iso_code)}</span>
              <span className="font-medium">
                {getLocalizedName(diveSite.country.name_en, diveSite.country.name_ru)}
              </span>
            </div>
          )}
          {diveSite.site_locations && diveSite.site_locations.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <span className="font-medium">
                {diveSite.site_locations
                  .map((sl) => getLocalizedName(sl.location.name_en, sl.location.name_ru))
                  .join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Основная информация */}
      <div className="w-full space-y-8">
                
        {/* Описание */}
        {diveSite.description && (
          <div className="space-y-3">
            <p className="text-slate-600 text-lg leading-relaxed">{diveSite.description}</p>
          </div>
        )}

        {/* Характеристики дайв-сайта */}
        <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-sm">
          <h4
            className="font-semibold text-slate-800 mb-4 flex items-center gap-2"
            suppressHydrationWarning
          >
            <span className="w-2 h-2 bg-deep-ocean rounded-full"></span>
            {t('characteristics')}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {diveSite.site_type && (
              <div className="flex items-center gap-3">
                <SiteTypeIcon
                  siteTypeId={diveSite.site_type.id}
                  className="w-5 h-5 flex-shrink-0 text-tropical-blue"
                />
                <div className="flex flex-col">
                  <span className="text-slate-600 text-xs" suppressHydrationWarning>
                    {t('type')}
                  </span>
                  <span className="font-medium text-slate-800">
                    {getLocalizedName(diveSite.site_type.label_en, diveSite.site_type.label_ru)}
                  </span>
                </div>
              </div>
            )}
            {diveSite.difficulty && (
              <div className="flex flex-col">
                <span className="text-slate-600 text-xs" suppressHydrationWarning>
                  {t('difficulty')}
                </span>
                <span className="font-medium text-slate-800">
                  {getLocalizedName(diveSite.difficulty.label_en, diveSite.difficulty.label_ru)}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-slate-600 text-xs" suppressHydrationWarning>
                {t('maxDepth')}
              </span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <span className="text-deep-ocean">↓</span>
                {diveSite.depth_max} <span suppressHydrationWarning>{t('meters')}</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-600 text-xs" suppressHydrationWarning>
                {t('visibility')}
              </span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <span className="text-deep-ocean">👁</span>
                {diveSite.visibility} <span suppressHydrationWarning>{t('meters')}</span>
              </span>
            </div>
            {diveSite.rating && (
              <div className="flex flex-col col-span-2">
                <span className="text-slate-600 text-xs" suppressHydrationWarning>
                  {t('rating')}
                </span>
                <span className="font-medium text-slate-800 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'text-lg',
                          i < diveSite.rating! ? 'text-yellow-400' : 'text-slate-300',
                        )}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-slate-500">({diveSite.rating}/5)</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Изображения */}
        {diveSite.images && diveSite.images.length > 0 && (
          <div className="space-y-4">
            <h4
              className="font-semibold text-slate-800 flex items-center gap-2"
              suppressHydrationWarning
            >
              <span className="w-2 h-2 bg-coral rounded-full"></span>
              {t('images')}
            </h4>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-sm">
              <ImageGallery images={diveSite.images} siteName={diveSite.name} maxPreviewCount={3} />
            </div>
          </div>
        )}

        {/* Ссылки */}
        {(diveSite.info_links && diveSite.info_links.length > 0) ||
        (diveSite.dive_center_links && diveSite.dive_center_links.length > 0) ? (
          <div className="space-y-4">
            <h4
              className="font-semibold text-slate-800 flex items-center gap-2"
              suppressHydrationWarning
            >
              <span className="w-2 h-2 bg-sea-green rounded-full"></span>
              {t('links')}
            </h4>
            <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-sm rounded-2xl p-4 border border-green-200/50 shadow-sm space-y-3">
              {diveSite.info_links?.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-tropical-blue hover:text-deep-ocean text-sm font-medium transition-colors duration-200 hover:underline flex items-center gap-2"
                >
                  <span className="text-sea-green">🔗</span>
                  <span suppressHydrationWarning>{t('infoLink')}</span> {index + 1}
                </a>
              ))}
              {diveSite.dive_center_links?.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-tropical-blue hover:text-deep-ocean text-sm font-medium transition-colors duration-200 hover:underline flex items-center gap-2"
                >
                  <span className="text-sea-green">🏊</span>
                  <span suppressHydrationWarning>{t('diveCenterLink')}</span> {index + 1}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
