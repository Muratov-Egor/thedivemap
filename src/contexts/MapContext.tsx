'use client';

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { Map } from 'maplibre-gl';
import { Site } from '@/types/database';
import { Cluster } from '@/types/clustering';

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
  onClusterClick: (cluster: Cluster) => void;
}

const MapContext = createContext<MapContextValue | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
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
        throw new Error('Failed to fetch dive sites');
      }

      const sites = await response.json();
      setDiveSites(sites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching dive sites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Обработка клика по сайту
  const onSiteClick = useCallback((site: Site) => {
    setSelectedSite(site);
  }, []);

  // Обработка клика по кластеру
  const onClusterClick = useCallback((cluster: Cluster) => {
    // Логика для обработки клика по кластеру
    console.log('Cluster clicked:', cluster);
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
      onClusterClick,
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
      onClusterClick,
    ],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMap must be used within MapProvider');
  return ctx;
}
