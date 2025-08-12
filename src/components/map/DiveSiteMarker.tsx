'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MarkerProps } from '@/types/clustering';

export default function DiveSiteMarker({ site, onClick, onHover, isActive = false }: MarkerProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
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
    onClick?.(site);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(site);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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
        className={`
         w-6 h-6 sm:w-8 sm:h-8 rounded-full
          bg-blue-600
          text-white
          flex items-center justify-center
          shadow-md border-2 border-white
          transition-all duration-200
          ${isHovered || isActive ? 'shadow-lg' : 'shadow-md'}
        `}
      >
        <span className="text-md sm:text-xl">🤿</span>
      </div>

      {/* Tooltip с информацией */}
      {(isHovered || isActive) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 text-sm whitespace-nowrap z-20">
          <div className="font-semibold text-gray-900">{site.name}</div>
          <div className="text-gray-600">{site.rating > 0 && ` ⭐️ ${site.rating}/5`}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      )}
    </div>
  );
}
