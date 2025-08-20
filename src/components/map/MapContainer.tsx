'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMap } from '@/contexts/MapContext';
import { usePanel } from '@/contexts/PanelContext';
import { useDiveSiteDetails } from '@/hooks/useDiveSiteDetails';
import DiveSitesLayer from './DiveSitesLayer';
import Notification from '@/components/ui/Notification';

export default function MapContainer({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation();
  const { t: tAutocomplete } = useTranslation('autocomplete');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [showNoResultsNotification, setShowNoResultsNotification] = useState(false);
  const [showNoDiveSitesNotification, setShowNoDiveSitesNotification] = useState(false);
  const {
    setMap,
    setLoaded,
    filteredDiveSites,
    selectedSite,
    loading,
    error,
    activeFilters,
    autocompleteInfoMessage,
    fetchDiveSites,
    onSiteClick,
    onClusterClick,
    setFetchDiveSiteDetailsCallback,
  } = useMap();

  const { showInfo, setClearDiveSiteHook } = usePanel();
  const { fetchDiveSiteDetails, diveSite, clearDiveSite: clearDiveSiteHook } = useDiveSiteDetails();

  // Регистрируем функции в контекстах
  const registerClearFunction = useCallback(() => {
    setClearDiveSiteHook(clearDiveSiteHook);
  }, [clearDiveSiteHook, setClearDiveSiteHook]);

  const registerFetchDetailsFunction = useCallback(() => {
    setFetchDiveSiteDetailsCallback(fetchDiveSiteDetails);
  }, [fetchDiveSiteDetails, setFetchDiveSiteDetailsCallback]);

  useEffect(() => {
    registerClearFunction();
    registerFetchDetailsFunction();
  }, [registerClearFunction, registerFetchDetailsFunction]);

  // Отслеживаем изменения в diveSite и переключаемся на информационную панель
  // только если это новая загрузка данных (не ручное переключение)
  useEffect(() => {
    if (diveSite && !loading) {
      showInfo(diveSite);
    }
  }, [diveSite, loading, showInfo]);

  // Обработчик показа деталей дайв-сайта
  const handleShowDetails = async (siteId: string) => {
    try {
      await fetchDiveSiteDetails(siteId);
    } catch (error) {
      console.error('Failed to fetch dive site details:', error);
    }
  };

  // Загружаем дайв-сайты при монтировании компонента
  useEffect(() => {
    fetchDiveSites();
  }, [fetchDiveSites]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: '/map-styles/arcgis_hybrid.json',
      center: [98.3774, 7.6079],
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
  const hasActiveFilters =
    activeFilters.siteTypeIds.length > 0 ||
    activeFilters.difficultyIds.length > 0 ||
    activeFilters.maxDepth !== null ||
    activeFilters.minVisibility !== null;
  const showNoResultsMessage = hasActiveFilters && !loading && filteredDiveSites.length === 0;

  // Управляем отображением уведомления о том, что нет результатов по фильтрам
  useEffect(() => {
    setShowNoResultsNotification(showNoResultsMessage);
  }, [showNoResultsMessage]);

  // Управляем отображением уведомления о том, что в локации нет дайв-сайтов
  useEffect(() => {
    setShowNoDiveSitesNotification(!!autocompleteInfoMessage);
  }, [autocompleteInfoMessage]);

  return (
    <div className="flex-1 relative">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {/* Слой дайв-сайтов */}
      <DiveSitesLayer
        map={mapRef.current}
        sites={filteredDiveSites}
        selectedSite={selectedSite}
        onSiteClick={onSiteClick}
        onClusterClick={onClusterClick}
        onShowDetails={handleShowDetails}
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

      {/* Уведомление о том, что нет результатов по фильтрам */}
      <Notification
        message={t('notification.noResults')}
        description={t('notification.noResultsDescription')}
        type="info"
        show={showNoResultsNotification}
        onClose={() => setShowNoResultsNotification(false)}
        duration={0} // Не скрывать автоматически
      />

      {/* Уведомление о том, что в выбранной локации нет дайв-сайтов */}
      <Notification
        message={autocompleteInfoMessage || tAutocomplete('noDiveSites.title')}
        description={tAutocomplete('noDiveSites.description')}
        type="warning"
        show={showNoDiveSitesNotification}
        onClose={() => setShowNoDiveSitesNotification(false)}
        duration={0} // Не скрывать автоматически
      />

      {children}
    </div>
  );
}
