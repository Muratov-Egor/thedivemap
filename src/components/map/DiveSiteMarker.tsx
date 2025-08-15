'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MarkerProps } from '../../types/clustering';
import Button from '@/components/ui/Button';
import { CloseIcon } from '@/components/icons';

const DiveSiteMarker = React.memo<MarkerProps>(
  ({ site, onClick, onHover, isActive = false }) => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const [isTooltipClosed, setIsTooltipClosed] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const markerRef = useRef<HTMLDivElement>(null);
    const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Автоматическое закрытие tooltip через 8 секунд
    useEffect(() => {
      if (isActive && !isTooltipVisible) {
        setIsTooltipVisible(true);
        setIsTooltipClosed(false);

        // Автоматическое закрытие через 8 секунд
        autoCloseTimerRef.current = setTimeout(() => {
          setIsTooltipVisible(false);
        }, 8000);
      } else if (!isActive) {
        setIsTooltipVisible(false);
        setIsTooltipClosed(false);
      }

      return () => {
        if (autoCloseTimerRef.current) {
          clearTimeout(autoCloseTimerRef.current);
          autoCloseTimerRef.current = null;
        }
      };
    }, [isActive, isTooltipVisible]);

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

    // Анимация при наведении
    useEffect(() => {
      if (markerRef.current) {
        if (isHovered || isActive) {
          markerRef.current.style.transform = 'scale(1.1)';
          markerRef.current.style.zIndex = '10';
        } else {
          markerRef.current.style.transform = 'scale(1)';
          markerRef.current.style.zIndex = '1';
        }
      }
    }, [isHovered, isActive]);

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick?.(site);
    };

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsHovered(false);
      setIsTooltipClosed(true);
      setIsTooltipVisible(false);

      // Очищаем таймер при ручном закрытии
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      setIsTooltipClosed(false);
      onHover?.(site);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    // Определяем, нужно ли показывать tooltip
    const shouldShowTooltip = (isHovered || isActive) && !isTooltipClosed && isTooltipVisible;

    return (
      <div
        ref={markerRef}
        className={`
        relative cursor-pointer
        transition-all duration-200 ease-out
      `}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`${t('map.markers.diveSite')}: ${site.name}`}
      >
        {/* Основной маркер */}
        <div
          className={`w-8 h-8 rounded-full
          bg-gradient-ocean
          text-white
          flex items-center justify-center
          shadow-glow-blue border-2 border-white
          transition-all duration-200
          ${isHovered || isActive ? 'shadow-glow-hover' : 'shadow-glow-blue'}`}
          data-testid={`dive-site-marker-${site.id}`}
        >
          <span className="text-sm sm:text-lg">🤿</span>
        </div>

        {/* Tooltip с информацией и анимациями */}
        {shouldShowTooltip && (
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
              onClick={handleClose}
              variant="glass"
              shape="circle"
              size="small"
              icon={<CloseIcon className="w-2 h-2" />}
              className="!absolute !-top-2 !-right-2 !w-6 !h-6 !p-0"
              aria-label={t('map.markers.closeTooltip')}
              data-testid={`dive-site-tooltip-close`}
            />
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Кастомная функция сравнения для React.memo
    return (
      prevProps.site.id === nextProps.site.id &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.onClick === nextProps.onClick &&
      prevProps.onHover === nextProps.onHover
    );
  },
);

DiveSiteMarker.displayName = 'DiveSiteMarker';

export default DiveSiteMarker;
