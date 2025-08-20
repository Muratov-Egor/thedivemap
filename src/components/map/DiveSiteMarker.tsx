'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MarkerProps } from '../../types/clustering';
import DiveSiteTooltip from './DiveSiteTooltip';

interface ExtendedMarkerProps extends MarkerProps {
  onShowDetails?: (siteId: string) => void;
}

const DiveSiteMarker = React.memo<ExtendedMarkerProps>(
  ({ site, onClick, onHover, onShowDetails, isActive = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isTooltipClosed, setIsTooltipClosed] = useState(false);
    const markerRef = useRef<HTMLDivElement>(null);

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
      setIsTooltipClosed(false);
      onClick?.(site);
    };

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsHovered(false);
      setIsTooltipClosed(true);
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
    const shouldShowTooltip = (isHovered || isActive) && !isTooltipClosed;

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
          shadow-glow-blue border-2 border-white/90 dark:border-slate-200
          transition-all duration-200
          ${isHovered || isActive ? 'shadow-glow-hover' : 'shadow-glow-blue'}`}
          data-testid={`dive-site-marker-${site.id}`}
        >
          <span className="text-sm sm:text-lg">🤿</span>
        </div>

        {/* Tooltip с информацией и анимациями */}
        {shouldShowTooltip && (
          <DiveSiteTooltip site={site} onClose={handleClose} onShowDetails={onShowDetails} />
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
      prevProps.onHover === nextProps.onHover &&
      prevProps.onShowDetails === nextProps.onShowDetails
    );
  },
);

DiveSiteMarker.displayName = 'DiveSiteMarker';

export default DiveSiteMarker;
