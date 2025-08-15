'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import maplibregl, { Map } from 'maplibre-gl';
import { useMap } from '@/contexts/MapContext';
import DiveSitesLayer from './DiveSitesLayer';

export default function MapContainer({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const {
    setMap,
    setLoaded,
    filteredDiveSites,
    selectedSite, // ✅ Добавляю selectedSite из MapContext
    loading,
    error,
    activeFilters,
    fetchDiveSites,
    onSiteClick,
    onClusterClick,
  } = useMap();

  // Загружаем дайв-сайты при монтировании компонента
  useEffect(() => {
    fetchDiveSites();
  }, [fetchDiveSites]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: '/map-styles/arcgis_hybrid.json',
      center: [98.379111, 7.609361],
      zoom: 0,
      maxZoom: 15,
      minZoom: 0,
      hash: false,
      touchZoomRotate: true,
      doubleClickZoom: true,
      scrollZoom: true,
      keyboard: true,
      dragPan: true,
      dragRotate: true,
    });

    mapRef.current = map;
    setMap(map);

    const nav = new maplibregl.NavigationControl({ visualizePitch: true });
    map.addControl(nav, 'top-right');

    const scale = new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' });
    map.addControl(scale);

    const onLoad = () => {
      setLoaded(true);
      // Убираем вызов fetchDiveSites отсюда - теперь данные загружаются параллельно
    };
    map.on('load', onLoad);

    return () => {
      map.off('load', onLoad);
      setLoaded(false);
      setMap(null);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [setLoaded, setMap]);

  // Проверяем, есть ли активные фильтры и нет ли результатов
  const hasActiveFilters = activeFilters.siteTypeIds.length > 0 || activeFilters.difficultyIds.length > 0;
  const showNoResultsMessage = hasActiveFilters && !loading && filteredDiveSites.length === 0;

  return (
    <div className="flex-1 relative">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {/* Слой дайв-сайтов */}
      <DiveSitesLayer
        map={mapRef.current}
        sites={filteredDiveSites}
        selectedSite={selectedSite} // ✅ Передаю selectedSite в DiveSitesLayer
        onSiteClick={onSiteClick}
        onClusterClick={onClusterClick}
      />

      {/* Индикатор загрузки */}
      {loading && (
        <div
          data-testid="loading-indicator"
          className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-4 py-2 text-sm text-gray-600"
        >
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            {t('map.loading')}
          </div>
        </div>
      )}

      {/* Индикатор ошибки */}
      {error && (
        <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
          Error: {error}
        </div>
      )}

      {/* Сообщение о том, что нет результатов */}
      {showNoResultsMessage && (
        <div 
          data-testid="no-results-message"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg px-6 py-4 text-center"
        >
          <div className="text-gray-600 text-lg font-medium">
            {t('map.noResults')}
          </div>
          <div className="text-gray-500 text-sm mt-2">
            {t('map.tryChangeFilters')}
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
