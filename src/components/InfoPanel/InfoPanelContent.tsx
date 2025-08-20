import { useState } from 'react';
import { DiveSiteDetails } from '@/lib/types/supabase';
import { getCountryFlag } from '@/lib/utils';
import { formatCoordinates } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { CloseIcon, SiteTypeIcon } from '@/components/icons';
import { Button } from '@/components/ui';
import { ImageGallery } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { useShareableLink } from '@/hooks/useShareableLink';

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
              className="shadow-glass hover:shadow-glass-hover"
              data-testid="info-panel-share-button"
            >
              {showCopiedMessage ? '✅' : isCopying ? '...' : '🔗'}
            </Button>
            <Button
              onClick={handleShowFilters}
              variant="primary"
              size="small"
              shape="circle"
              aria-label={t('backToFilters')}
              className="shadow-glass hover:shadow-glass-hover"
            >
              <CloseIcon />
            </Button>
          </div>
        </div>
        {/* Координаты и местоположение */}
        <div className="flex items-center gap-4 mt-3 text-slate-600 dark:text-slate-400 text-sm">
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
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50 shadow-sm">
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              {diveSite.description}
            </p>
          </div>
        )}

        {/* Характеристики дайв-сайта */}
        <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/60 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50 dark:border-blue-600/50 shadow-sm">
          <h4
            className="font-semibold text-slate-800 dark:text-slate-200 mb-4"
            suppressHydrationWarning
          >
            {t('characteristics')}
          </h4>

          <div className="space-y-2">
            {diveSite.site_type && (
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-tropical-blue/15 rounded-lg">
                    <SiteTypeIcon
                      siteTypeId={diveSite.site_type.id}
                      className="w-5 h-5 text-tropical-blue"
                    />
                  </div>
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
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-tropical-blue/15 rounded-lg">
                    <svg
                      className="w-5 h-5 text-tropical-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
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

            <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-tropical-blue/15 rounded-lg">
                  <svg
                    className="w-5 h-5 text-tropical-blue"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-600" suppressHydrationWarning>
                  {t('maxDepth')}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800">
                {diveSite.depth_max} <span suppressHydrationWarning>{t('meters')}</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-tropical-blue/15 rounded-lg">
                  <svg
                    className="w-5 h-5 text-tropical-blue"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-600" suppressHydrationWarning>
                  {t('visibility')}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800">
                {diveSite.visibility} <span suppressHydrationWarning>{t('meters')}</span>
              </span>
            </div>

            {diveSite.rating !== 0 && (
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-tropical-blue/15 rounded-lg">
                    <svg
                      className="w-5 h-5 text-tropical-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
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
                        ★
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
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50 shadow-sm">
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
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50 shadow-sm">
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
                  className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors duration-200"
                >
                  <div className="p-2 bg-tropical-blue/15 rounded-lg">
                    <svg
                      className="w-5 h-5 text-tropical-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
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
                  className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors duration-200"
                >
                  <div className="p-2 bg-tropical-blue/15 rounded-lg">
                    <svg
                      className="w-5 h-5 text-tropical-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
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
