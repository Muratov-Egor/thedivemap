'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { DiveSiteDetails } from '@/lib/types/supabase';
import { usePanel } from '@/contexts/PanelContext';
import { useDiveSiteDetails as useDiveSiteDetailsHook } from '@/hooks/useDiveSiteDetails';
import Button from '@/components/ui/Button';
import { SiteTypeIcon } from '@/components/icons';
import Image from 'next/image';

interface InfoPanelProps {
  diveSite?: DiveSiteDetails;
}

export default function InfoPanel({ diveSite: propDiveSite }: InfoPanelProps) {
  const { t } = useTranslation('infoPanel');
  const { showFilters } = usePanel();
  const { diveSite: hookDiveSite, loading, error } = useDiveSiteDetailsHook();

  // Используем данные из пропсов или из хука
  const diveSite = propDiveSite || hookDiveSite;

  const handleShowFilters = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showFilters();
  };

  // Форматирование координат
  const formatCoordinates = (lat: number, lng: number) => {
    const latStr = Math.abs(lat).toFixed(4) + (lat >= 0 ? '°N' : '°S');
    const lngStr = Math.abs(lng).toFixed(4) + (lng >= 0 ? '°E' : '°W');
    return `${latStr}, ${lngStr}`;
  };

  // Получение локализованного названия
  const getLocalizedName = (nameEn: string, nameRu: string) => {
    const currentLang = document.documentElement.lang || 'ru';
    return currentLang === 'ru' ? nameRu : nameEn;
  };

  if (loading) {
    return (
      <div
        className="flex flex-col justify-start items-center w-[500px] border-l border-gray-200 p-6 overflow-y-auto max-h-screen"
        data-testid="desktop-info-panel"
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600" suppressHydrationWarning>
            {t('loading')}
          </span>
        </div>
      </div>
    );
  }

  if (error || !diveSite) {
    return (
      <div
        className="flex flex-col justify-start items-center w-[500px] border-l border-gray-200 p-6 overflow-y-auto max-h-screen"
        data-testid="desktop-info-panel"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6" suppressHydrationWarning>
          {t('title')}
        </h2>
        <div className="text-center text-gray-600">
          <p suppressHydrationWarning>{error || t('noData')}</p>
          <Button onClick={handleShowFilters} variant="primary" size="small" className="mt-4">
            <span suppressHydrationWarning>{t('backToFilters')}</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-start items-center w-[500px] border-l border-gray-200 p-6 overflow-y-auto max-h-screen"
      data-testid="desktop-info-panel"
    >
      {/* Заголовок с кнопкой возврата */}
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-xl font-bold text-gray-800" suppressHydrationWarning>
          {t('title')}
        </h2>
        <Button
          onClick={handleShowFilters}
          variant="glass"
          size="small"
          aria-label={t('backToFilters')}
        >
          {t('backToFilters')}
        </Button>
      </div>

      {/* Основная информация */}
      <div className="w-full space-y-6">
        {/* Название */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{diveSite.name}</h3>
          {diveSite.description && <p className="text-gray-600 text-sm">{diveSite.description}</p>}
        </div>

        {/* Координаты */}
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span className="text-tropical-blue">📍</span>
          {formatCoordinates(diveSite.latitude, diveSite.longitude)}
        </div>

        {/* Географическая информация */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3" suppressHydrationWarning>
            {t('location')}
          </h4>
          <div className="space-y-2 text-sm">
            {diveSite.country && (
              <div>
                <span className="text-gray-600" suppressHydrationWarning>
                  {t('country')}:{' '}
                </span>
                <span className="font-medium">
                  {getLocalizedName(diveSite.country.name_en, diveSite.country.name_ru)}
                </span>
              </div>
            )}
            {diveSite.country?.region && (
              <div>
                <span className="text-gray-600" suppressHydrationWarning>
                  {t('region')}:{' '}
                </span>
                <span className="font-medium">
                  {getLocalizedName(
                    diveSite.country.region.name_en,
                    diveSite.country.region.name_ru,
                  )}
                </span>
              </div>
            )}
            {diveSite.site_locations && diveSite.site_locations.length > 0 && (
              <div>
                <span className="text-gray-600" suppressHydrationWarning>
                  {t('locations')}:{' '}
                </span>
                <span className="font-medium">
                  {diveSite.site_locations
                    .map((sl) => getLocalizedName(sl.location.name_en, sl.location.name_ru))
                    .join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Характеристики дайв-сайта */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3" suppressHydrationWarning>
            {t('characteristics')}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {diveSite.site_type && (
              <div className="flex items-center gap-2">
                <SiteTypeIcon
                  siteTypeId={diveSite.site_type.id}
                  className="w-4 h-4 flex-shrink-0"
                />
                <span className="text-gray-600" suppressHydrationWarning>
                  {t('type')}:{' '}
                </span>
                <span className="font-medium">
                  {getLocalizedName(diveSite.site_type.label_en, diveSite.site_type.label_ru)}
                </span>
              </div>
            )}
            {diveSite.difficulty && (
              <div>
                <span className="text-gray-600" suppressHydrationWarning>
                  {t('difficulty')}:{' '}
                </span>
                <span className="font-medium">
                  {getLocalizedName(diveSite.difficulty.label_en, diveSite.difficulty.label_ru)}
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-600" suppressHydrationWarning>
                {t('maxDepth')}:{' '}
              </span>
              <span className="font-medium">
                {diveSite.depth_max} <span suppressHydrationWarning>{t('meters')}</span>
              </span>
            </div>
            <div>
              <span className="text-gray-600" suppressHydrationWarning>
                {t('visibility')}:{' '}
              </span>
              <span className="font-medium">
                {diveSite.visibility} <span suppressHydrationWarning>{t('meters')}</span>
              </span>
            </div>
            {diveSite.rating && (
              <div>
                <span className="text-gray-600" suppressHydrationWarning>
                  {t('rating')}:{' '}
                </span>
                <span className="font-medium">{diveSite.rating}/5</span>
              </div>
            )}
          </div>
        </div>

        {/* Изображения */}
        {diveSite.images && diveSite.images.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3" suppressHydrationWarning>
              {t('images')}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {diveSite.images.map((image) => (
                <div key={image.id} className="aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt={`${diveSite.name} - ${t('image')}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ссылки */}
        {(diveSite.info_links && diveSite.info_links.length > 0) ||
        (diveSite.dive_center_links && diveSite.dive_center_links.length > 0) ? (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3" suppressHydrationWarning>
              {t('links')}
            </h4>
            <div className="space-y-2">
              {diveSite.info_links?.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  <span suppressHydrationWarning>{t('infoLink')}</span> {index + 1}
                </a>
              ))}
              {diveSite.dive_center_links?.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm underline"
                >
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
