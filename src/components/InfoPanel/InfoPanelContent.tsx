import { useState } from 'react';
import { DiveSiteDetails } from '@/lib/types/supabase';
import { getCountryFlag } from '@/lib/utils';
import { formatCoordinates } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  CloseIcon,
  SiteTypeIcon,
  DifficultyIcon,
  MarkIcon,
  DepthIcon,
  VisibilityIcon,
  StarIcon,
  DiveCenterIcon,
  InfoIcon,
  TagIcon,
} from '@/components/icons';
import { Button } from '@/components/ui';
import { ImageGallery } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { useShareableLink } from '@/hooks/useShareableLink';
import { CheckIcon, LinkIcon } from '@/components/icons';

export default function InfoPanelContent({
  diveSite,
  handleShowFilters,
}: {
  diveSite: DiveSiteDetails;
  handleShowFilters: (e: React.MouseEvent) => void;
}) {
  const { t } = useTranslation('infoPanel');
  const { copyShareableLink, isCopying } = useShareableLink();
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Получение локализованного названия
  const getLocalizedName = (nameEn: string, nameRu: string) => {
    const currentLang = document.documentElement.lang || 'ru';
    return currentLang === 'ru' ? nameRu : nameEn;
  };

  const handleShare = async () => {
    const success = await copyShareableLink(diveSite.id);
    if (success) {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
  };

  return (
    <>
      {/* Заголовок с кнопкой возврата */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between">
          <h2
            className="text-3xl font-bold text-slate-800 dark:text-slate-200"
            suppressHydrationWarning
          >
            {getCountryFlag(diveSite.country.iso_code)} {diveSite.name}
          </h2>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleShare}
              variant="secondary"
              shape="circle"
              size="small"
              disabled={isCopying}
              aria-label="Поделиться ссылкой"
              className="shadow-simple hover:shadow-simple-hover"
              data-testid="info-panel-share-button"
            >
              {showCopiedMessage ? (
                <CheckIcon size={16} scale={200} />
              ) : isCopying ? (
                '...'
              ) : (
                <LinkIcon size={16} scale={200} />
              )}
            </Button>
            <Button
              onClick={handleShowFilters}
              variant="primary"
              size="small"
              shape="circle"
              aria-label={t('backToFilters')}
              className="shadow-simple hover:shadow-simple-hover"
            >
              <CloseIcon />
            </Button>
          </div>
        </div>
        {/* Координаты и местоположение */}
        <div className="flex items-center gap-4 mt-3 text-slate-600 dark:text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <MarkIcon size={14} scale={200} />
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
              <TagIcon size={14} scale={200} />
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-slate-300/70 dark:border-slate-600 shadow-simple">
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              {diveSite.description}
            </p>
          </div>
        )}

        {/* Характеристики дайв-сайта - ИСПРАВЛЕНО */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-slate-200 dark:border-slate-600 shadow-simple">
          <h4
            className="font-semibold text-slate-800 dark:text-slate-200 mb-4"
            suppressHydrationWarning
          >
            {t('characteristics')}
          </h4>

          <div className="space-y-2">
            {diveSite.site_type && (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <SiteTypeIcon
                    siteTypeId={diveSite.site_type.id}
                    className="w-5 h-5 text-primary-action"
                  />

                  <span
                    className="text-sm font-medium text-slate-600 dark:text-slate-400"
                    suppressHydrationWarning
                  >
                    {t('type')}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {getLocalizedName(diveSite.site_type.label_en, diveSite.site_type.label_ru)}
                </span>
              </div>
            )}

            {diveSite.difficulty && (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <DifficultyIcon
                    difficulty={diveSite.difficulty.id as 1 | 2 | 3}
                    size={20}
                    withBackground={true}
                    className="text-primary-action"
                    scale={150}
                  />

                  <span
                    className="text-sm font-medium text-slate-600 dark:text-slate-400"
                    suppressHydrationWarning
                  >
                    {t('difficulty')}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {getLocalizedName(diveSite.difficulty.label_en, diveSite.difficulty.label_ru)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <DepthIcon size={16} withBackground scale={200} />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400" suppressHydrationWarning>
                  {t('maxDepth')}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {diveSite.depth_max} <span suppressHydrationWarning>{t('meters')}</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <VisibilityIcon size={16} withBackground scale={200} />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400" suppressHydrationWarning>
                  {t('visibility')}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {diveSite.visibility} <span suppressHydrationWarning>{t('meters')}</span>
              </span>
            </div>

            {diveSite.rating !== 0 && (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-xl border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <StarIcon size={16} withBackground scale={200} />
                  <span
                    className="text-sm font-medium text-slate-600 dark:text-slate-400"
                    suppressHydrationWarning
                  >
                    {t('rating')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'text-lg',
                          i < diveSite.rating! ? 'text-yellow-400' : 'text-slate-300',
                        )}
                      >
                        <StarIcon size={16} scale={100} />
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    ({diveSite.rating}/5)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Изображения */}
        {diveSite.images && diveSite.images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-slate-300/70 dark:border-slate-600 shadow-simple">
            <h4
              className="font-semibold text-slate-800 dark:text-slate-200 mb-4"
              suppressHydrationWarning
            >
              {t('images')}
            </h4>
            <ImageGallery images={diveSite.images} siteName={diveSite.name} maxPreviewCount={3} />
          </div>
        )}

        {/* Ссылки */}
        {(diveSite.info_links && diveSite.info_links.length > 0) ||
        (diveSite.dive_center_links && diveSite.dive_center_links.length > 0) ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-slate-300/70 dark:border-slate-600 shadow-simple">
            <h4
              className="font-semibold text-slate-800 dark:text-slate-200 mb-4"
              suppressHydrationWarning
            >
              {t('links')}
            </h4>
            <div className="space-y-3">
              {diveSite.info_links?.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                >
                  <DiveCenterIcon size={16} withBackground scale={200} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span suppressHydrationWarning>{t('infoLink')}</span> {index + 1}
                  </span>
                </a>
              ))}
              {diveSite.dive_center_links?.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                >
                  <InfoIcon size={16} withBackground scale={200} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span suppressHydrationWarning>{t('diveCenterLink')}</span> {index + 1}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
