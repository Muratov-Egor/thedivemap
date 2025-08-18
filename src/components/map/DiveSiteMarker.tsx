'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MarkerProps } from '../../types/clustering';
import DiveSiteTooltip from './DiveSiteTooltip';

const DiveSiteMarker = React.memo<MarkerProps>(
  ({ site, onClick, onHover, isActive = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isTooltipClosed, setIsTooltipClosed] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const markerRef = useRef<HTMLDivElement>(null);
    const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Автоматическое закрытие tooltip через 8 секунд
    useEffect(() => {
      if (isActive && !isTooltipVisible && !isTooltipClosed) {
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
    }, [isActive, isTooltipVisible, isTooltipClosed]);

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
      // Сбрасываем состояние закрытия при новом клике на маркер
      setIsTooltipClosed(false);
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
      // Сбрасываем состояние закрытия при наведении
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
        aria-label={`Dive site: ${site.name}`}
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
        {shouldShowTooltip && <DiveSiteTooltip site={site} onClose={handleClose} />}
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
