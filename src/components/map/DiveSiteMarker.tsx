'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MarkerProps } from '@/types/clustering';

export default function DiveSiteMarker({ site, onClick, onHover, isActive = false }: MarkerProps) {
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

  // Определяем цвет маркера на основе типа дайв-сайта
  const getMarkerColor = () => {
    switch (site.site_type_id) {
      case 1:
        return 'bg-blue-600'; // Reef
      case 2:
        return 'bg-green-600'; // Wreck
      case 3:
        return 'bg-purple-600'; // Wall
      case 4:
        return 'bg-yellow-600'; // Cave
      default:
        return 'bg-blue-600';
    }
  };

  // Определяем иконку на основе типа дайв-сайта
  const getMarkerIcon = () => {
    switch (site.site_type_id) {
      case 1:
        return '🐠'; // Reef
      case 2:
        return '🚢'; // Wreck
      case 3:
        return '🏔️'; // Wall
      case 4:
        return '🕳️'; // Cave
      default:
        return '🏊'; // Default
    }
  };

  return (
    <div
      ref={markerRef}
      className={`
        relative cursor-pointer
        transition-all duration-200 ease-out
        ${isActive ? 'ring-4 ring-blue-200' : ''}
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
        className={`
          w-8 h-8 rounded-full
          ${getMarkerColor()}
          text-white
          flex items-center justify-center
          shadow-md border-2 border-white
          transition-all duration-200
          ${isHovered || isActive ? 'shadow-lg' : 'shadow-md'}
        `}
      >
        <span className="text-sm">{getMarkerIcon()}</span>
      </div>

      {/* Индикатор рейтинга */}
      {site.rating > 0 && (
        <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {Math.round(site.rating)}
        </div>
      )}

      {/* Индикатор глубины */}
      {site.depth_max > 0 && (
        <div className="absolute -bottom-1 -left-1 bg-gray-800 text-white text-xs rounded-full px-1 py-0.5 font-medium">
          {site.depth_max}m
        </div>
      )}

      {/* Tooltip с информацией */}
      {(isHovered || isActive) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 text-sm whitespace-nowrap z-20">
          <div className="font-semibold text-gray-900">{site.name}</div>
          <div className="text-gray-600">
            {site.depth_max > 0 && `${site.depth_max}m`}
            {site.rating > 0 && ` • ${site.rating}/5`}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      )}
    </div>
  );
}
