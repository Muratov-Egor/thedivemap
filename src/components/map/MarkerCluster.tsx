'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClusterMarkerProps } from '@/types/clustering';

export default function MarkerCluster({
  cluster,
  onClick,
  onHover,
  isActive = false,
}: ClusterMarkerProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const clusterRef = useRef<HTMLDivElement>(null);

  // Анимация при наведении
  useEffect(() => {
    if (clusterRef.current) {
      if (isHovered || isActive) {
        clusterRef.current.style.transform = 'scale(1.1)';
        clusterRef.current.style.zIndex = '10';
      } else {
        clusterRef.current.style.transform = 'scale(1)';
        clusterRef.current.style.zIndex = '1';
      }
    }
  }, [isHovered, isActive]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(cluster);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(cluster);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Определяем размер кластера на основе количества точек
  const getClusterSize = () => {
    if (cluster.count >= 100) return 'w-12 h-12 text-lg';
    if (cluster.count >= 50) return 'w-11 h-11 text-base';
    if (cluster.count >= 20) return 'w-10 h-10 text-base';
    if (cluster.count >= 10) return 'w-9 h-9 text-sm';
    return 'w-8 h-8 text-sm';
  };

  // Определяем цвет кластера на основе количества точек
  const getClusterColor = () => {
    if (cluster.count >= 100) return 'bg-gradient-coral';
    if (cluster.count >= 50) return 'bg-gradient-ocean';
    if (cluster.count >= 20) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    if (cluster.count >= 10) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    return 'bg-gradient-to-r from-green-500 to-emerald-600';
  };

  // Форматируем количество точек для отображения
  const formatCount = (count: number) => {
    if (count >= 1000) return `${Math.round(count / 1000)}k`;
    if (count >= 100) return `${Math.round(count / 100)}00+`;
    return count.toString();
  };

  return (
    <div
      ref={clusterRef}
      className={`
        relative cursor-pointer
        transition-all duration-300 ease-out
        ${isActive ? 'ring-4 ring-coral/30' : ''}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Cluster with ${cluster.count} ${t('map.markers.diveSites')}`}
    >
      {/* Основной кластер */}
      <div
        className={`
          ${getClusterSize()}
          ${getClusterColor()}
          text-white
          rounded-full
          flex items-center justify-center
          font-semibold
          shadow-glow-blue border-2 border-white
          transition-all duration-300
          ${isHovered || isActive ? 'shadow-glow-hover' : 'shadow-glow-blue'}
        `}
        data-testid={`marker-cluster`}
      >
        {formatCount(cluster.count)}
      </div>

      {/* Пульсирующая анимация для активного кластера */}
      {isActive && <div className="absolute inset-0 rounded-full bg-coral/75 animate-ping"></div>}

      {/* Tooltip с информацией */}
      {(isHovered || isActive) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 text-sm whitespace-nowrap z-20">
          <div className="font-semibold text-gray-900">
            {cluster.count}{' '}
            {cluster.count === 1
              ? t('map.markers.diveSiteSingular')
              : t('map.markers.diveSitePlural')}
          </div>
          <div className="text-gray-600">{t('map.markers.clickToZoom')}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      )}
    </div>
  );
}
