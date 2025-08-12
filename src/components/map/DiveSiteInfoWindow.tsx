'use client';

import React, { useEffect, useRef } from 'react';
import { InfoWindowProps } from '@/types/clustering';

export default function DiveSiteInfoWindow({
  site,
  position,
  onClose,
  isVisible,
}: InfoWindowProps) {
  const infoWindowRef = useRef<HTMLDivElement>(null);

  // Анимация появления/исчезновения
  useEffect(() => {
    if (infoWindowRef.current) {
      if (isVisible) {
        infoWindowRef.current.style.opacity = '1';
        infoWindowRef.current.style.transform = 'scale(1) translateY(0)';
      } else {
        infoWindowRef.current.style.opacity = '0';
        infoWindowRef.current.style.transform = 'scale(0.9) translateY(-10px)';
      }
    }
  }, [isVisible]);

  // Обработка клика вне окна
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoWindowRef.current && !infoWindowRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // Обработка клавиши Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Определяем тип дайв-сайта
  const getSiteTypeLabel = () => {
    switch (site.site_type_id) {
      case 1:
        return 'Reef';
      case 2:
        return 'Wreck';
      case 3:
        return 'Wall';
      case 4:
        return 'Cave';
      default:
        return 'Site';
    }
  };

  // Определяем сложность
  const getDifficultyLabel = () => {
    switch (site.difficulty_id) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Intermediate';
      case 3:
        return 'Advanced';
      case 4:
        return 'Expert';
      default:
        return 'Unknown';
    }
  };

  // Форматируем рейтинг
  const formatRating = (rating: number) => {
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return stars;
  };

  return (
    <div
      ref={infoWindowRef}
      className="absolute z-50 bg-white rounded-lg shadow-xl border border-blue-200 p-4 max-w-sm transition-all duration-200 ease-out"
      style={{
        left: position[0],
        top: position[1],
        opacity: 0,
        transform: 'scale(0.9) translateY(-10px)',
      }}
      role="dialog"
      aria-labelledby="dive-site-title"
      aria-describedby="dive-site-description"
    >
      {/* Заголовок */}
      <div className="flex justify-between items-start mb-3">
        <h3 id="dive-site-title" className="text-lg font-semibold text-gray-900">
          {site.name}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
          aria-label="Close information window"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Основная информация */}
      <div id="dive-site-description" className="space-y-3">
        {/* Тип и сложность */}
        <div className="flex gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getSiteTypeLabel()}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {getDifficultyLabel()}
          </span>
        </div>

        {/* Описание */}
        {site.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{site.description}</p>
        )}

        {/* Детали */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Максимальная глубина */}
          {site.depth_max > 0 && (
            <div>
              <span className="text-gray-500">Max Depth:</span>
              <div className="font-medium text-gray-900">{site.depth_max}m</div>
            </div>
          )}

          {/* Видимость */}
          {site.visibility > 0 && (
            <div>
              <span className="text-gray-500">Visibility:</span>
              <div className="font-medium text-gray-900">{site.visibility}m</div>
            </div>
          )}

          {/* Рейтинг */}
          {site.rating > 0 && (
            <div className="col-span-2">
              <span className="text-gray-500">Rating:</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-sm">{formatRating(site.rating)}</span>
                <span className="text-sm text-gray-600">({site.rating.toFixed(1)})</span>
              </div>
            </div>
          )}
        </div>

        {/* Ссылки */}
        {site.info_links && site.info_links.length > 0 && (
          <div>
            <span className="text-gray-500 text-sm">More Info:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {site.info_links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Link {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Дайв-центры */}
        {site.dive_center_links && site.dive_center_links.length > 0 && (
          <div>
            <span className="text-gray-500 text-sm">Dive Centers:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {site.dive_center_links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 text-sm underline"
                >
                  Center {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Стрелка */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
    </div>
  );
}
