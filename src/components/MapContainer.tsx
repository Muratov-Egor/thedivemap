'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import maplibregl, { Map } from 'maplibre-gl';
import { MapProvider, useMap } from '@/contexts/MapContext';
import DiveSitesLayer from './map/DiveSitesLayer';

function InnerMapContainer({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const {
    setMap,
    setLoaded,
    diveSites,
    loading,
    error,
    fetchDiveSites,
    onSiteClick,
    onClusterClick,
  } = useMap();

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
      // Загружаем дайв-сайты после загрузки карты
      fetchDiveSites();
    };
    map.on('load', onLoad);

    return () => {
      map.off('load', onLoad);
      setLoaded(false);
      setMap(null);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [setLoaded, setMap, fetchDiveSites]);

  return (
    <div className="flex-1 relative">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {/* Слой дайв-сайтов */}
      <DiveSitesLayer
        map={mapRef.current}
        sites={diveSites}
        onSiteClick={onSiteClick}
        onClusterClick={onClusterClick}
      />

      {/* Индикатор загрузки */}
      {loading && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-4 py-2 text-sm text-gray-600">
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

      {children}
    </div>
  );
}

export default function MapContainer({ children }: { children?: React.ReactNode }) {
  return (
    <MapProvider>
      <InnerMapContainer>{children}</InnerMapContainer>
    </MapProvider>
  );
}
