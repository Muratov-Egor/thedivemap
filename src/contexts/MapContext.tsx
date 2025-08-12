'use client';

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Map } from 'maplibre-gl';
import { Site } from '@/types/database';

interface MapContextValue {
  map: Map | null;
  isLoaded: boolean;
  diveSites: Site[];
  selectedSite: Site | null;
  loading: boolean;
  error: string | null;
  setMap: (map: Map | null) => void;
  setLoaded: (loaded: boolean) => void;
  fetchDiveSites: () => Promise<void>;
  selectSite: (site: Site | null) => void;
  onSiteClick: (site: Site) => void;
}

const MapContext = createContext<MapContextValue | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [map, setMap] = useState<Map | null>(null);
  const [isLoaded, setLoaded] = useState(false);
  const [diveSites, setDiveSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка дайв-сайтов
  const fetchDiveSites = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dive-sites');
      if (!response.ok) {
        throw new Error(t('map.error.fetchFailed'));
      }

      const sites = await response.json();
      setDiveSites(sites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error(t('map.error.fetchError'), err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Обработка клика по сайту
  const onSiteClick = useCallback((site: Site) => {
    setSelectedSite(site);
  }, []);

  // Выбор сайта
  const selectSite = useCallback((site: Site | null) => {
    setSelectedSite(site);
  }, []);

  const value = useMemo(
    () => ({
      map,
      isLoaded,
      diveSites,
      selectedSite,
      loading,
      error,
      setMap,
      setLoaded,
      fetchDiveSites,
      selectSite,
      onSiteClick,
    }),
    [
      map,
      isLoaded,
      diveSites,
      selectedSite,
      loading,
      error,
      fetchDiveSites,
      selectSite,
      onSiteClick,
    ],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMap must be used within MapProvider');
  return ctx;
}
