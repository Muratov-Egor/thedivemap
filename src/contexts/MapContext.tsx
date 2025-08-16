'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { Map } from 'maplibre-gl';
import { Site } from '@/types/database';
import { Cluster } from '@/types/clustering';
import { AutocompleteItem } from '@/components/ui/Autocomplete/types';

interface MapContextValue {
  map: Map | null;
  isLoaded: boolean;
  diveSites: Site[];
  filteredDiveSites: Site[];
  selectedSite: Site | null;
  loading: boolean;
  error: string | null;
  autocompleteInfoMessage: string | null;
  activeFilters: {
    siteTypeIds: number[];
    difficultyIds: number[];
    maxDepth: number | null;
    minVisibility: number | null;
    minRating: number | null;
  };
  setMap: (map: Map | null) => void;
  setLoaded: (loaded: boolean) => void;
  fetchDiveSites: () => Promise<void>;
  selectSite: (site: Site | null) => void;
  onSiteClick: (site: Site) => void;
  onClusterClick: (cluster: Cluster) => void;
  // Новые методы для центрирования карты
  centerOnSelection: (item: AutocompleteItem) => Promise<void>;
  clearAutocompleteInfoMessage: () => void;
  // Методы для фильтрации
  setSiteTypeFilter: (siteTypeId: number) => void;
  setDifficultyFilter: (difficultyId: number) => void;
  setMaxDepthFilter: (maxDepth: number | null) => void;
  setMinVisibilityFilter: (minVisibility: number | null) => void;
  setMinRatingFilter: (minRating: number | null) => void;
  clearFilters: () => void;
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
  const [autocompleteInfoMessage, setAutocompleteInfoMessage] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    siteTypeIds: number[];
    difficultyIds: number[];
    maxDepth: number | null;
    minVisibility: number | null;
    minRating: number | null;
  }>({
    siteTypeIds: [],
    difficultyIds: [],
    maxDepth: null,
    minVisibility: null,
    minRating: null,
  });
  const hasFetchedRef = useRef(false);

  // Загрузка дайв-сайтов
  const fetchDiveSites = useCallback(async () => {
    // Предотвращаем повторные запросы
    if (hasFetchedRef.current || loading) {
      return;
    }

    setLoading(true);
    setError(null);
    hasFetchedRef.current = true;

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
      // Сбрасываем флаг в случае ошибки, чтобы можно было повторить запрос
      hasFetchedRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [t, loading]);

  // Сброс флага при инициализации карты
  useEffect(() => {
    if (map && !hasFetchedRef.current) {
      hasFetchedRef.current = false;
    }
  }, [map]);

  // Выбор сайта
  const selectSite = useCallback((site: Site | null) => {
    setSelectedSite(site);
  }, []);

  // Центрирование карты на выбранном элементе
  const centerOnSelection = useCallback(
    async (item: AutocompleteItem) => {
      if (!map) {
        console.error('Map is not initialized');
        return;
      }

      try {
        switch (item.type) {
          case 'site':
            // Для конкретного сайта - центрируем на нем и зумим
            const siteResponse = await fetch(`/api/dive-sites?id=${item.id}`);
            if (siteResponse.ok) {
              const sites = await siteResponse.json();
              if (sites.length > 0) {
                const site = sites[0];
                map.flyTo({
                  center: [site.longitude, site.latitude],
                  zoom: 15, // Более детальный обзор для конкретного сайта
                  duration: 1000,
                });
                // Выбираем сайт для показа попапа
                selectSite(site);
              }
            }
            break;

          case 'country':
          case 'region':
          case 'location':
            // Для страны/региона/локации - получаем границы и зумим к ним
            const boundsResponse = await fetch(`/api/bounds?type=${item.type}&id=${item.id}`);
            if (boundsResponse.ok) {
              const bounds = await boundsResponse.json();

              // Проверяем, не является ли ответ ошибкой
              if (bounds.error) {
                console.warn(
                  `No dive sites found for ${item.type}: ${item.name} - ${bounds.error}`,
                );
                return;
              }

              if (bounds && bounds.length === 4) {
                // Проверяем, что bounds корректные
                const [minLng, minLat, maxLng, maxLat] = bounds;

                if (minLng < maxLng && minLat < maxLat) {
                  // Универсальный подход: используем fitBounds для всех устройств
                  // Адаптивный padding и ограничения зума для оптимального отображения
                  const mapContainer = map.getContainer();
                  const isMobile = mapContainer.offsetWidth < 768;
                  const padding = isMobile ? 50 : 300;
                  const minZoom = 3; // Минимальный зум для очень больших областей
                  const maxZoom = 12; // Максимальный зум для детального обзора

                  map.fitBounds(bounds, {
                    padding: padding,
                    duration: 1000,
                    maxZoom: maxZoom,
                    minZoom: minZoom,
                  });
                } else {
                  console.error('Invalid bounds: min values must be less than max values');
                }
              } else {
                console.error('Invalid bounds format: expected array of 4 numbers');
              }
            } else if (boundsResponse.status === 404) {
              console.warn(`No dive sites found for ${item.type}: ${item.name}`);
              // Показываем сообщение об отсутствии дайв-сайтов
              const message = t('autocomplete:noDiveSites.title', { location: item.name });
              setAutocompleteInfoMessage(message);
              // Автоматически очищаем сообщение через 8 секунд
              setTimeout(() => {
                setAutocompleteInfoMessage(null);
              }, 8000);
            } else {
              console.error('Failed to fetch bounds:', boundsResponse.status);
            }
            break;
        }
      } catch (err) {
        console.error('Error centering on selection:', err);
      }
    },
    [map, selectSite, t],
  );

  // Обработка клика по сайту
  const onSiteClick = useCallback((site: Site) => {
    setSelectedSite(site);
  }, []);

  // Обработка клика по кластеру
  const onClusterClick = useCallback(() => {
    // Логика обработки клика по кластеру
    // TODO: Реализовать логику обработки кластера
  }, []);

  // Очистка сообщения об отсутствии дайв-сайтов
  const clearAutocompleteInfoMessage = useCallback(() => {
    setAutocompleteInfoMessage(null);
  }, []);

  // Методы для фильтрации
  const setSiteTypeFilter = useCallback((siteTypeId: number) => {
    setActiveFilters((prev) => {
      const isSelected = prev.siteTypeIds.includes(siteTypeId);
      if (isSelected) {
        // Удаляем фильтр если он уже выбран
        return { ...prev, siteTypeIds: prev.siteTypeIds.filter((id) => id !== siteTypeId) };
      } else {
        // Добавляем фильтр если он не выбран
        return { ...prev, siteTypeIds: [...prev.siteTypeIds, siteTypeId] };
      }
    });
  }, []);

  const setDifficultyFilter = useCallback((difficultyId: number) => {
    setActiveFilters((prev) => {
      const isSelected = prev.difficultyIds.includes(difficultyId);
      if (isSelected) {
        // Удаляем фильтр если он уже выбран
        return { ...prev, difficultyIds: prev.difficultyIds.filter((id) => id !== difficultyId) };
      } else {
        // Добавляем фильтр если он не выбран
        return { ...prev, difficultyIds: [...prev.difficultyIds, difficultyId] };
      }
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({
      siteTypeIds: [],
      difficultyIds: [],
      maxDepth: null,
      minVisibility: null,
      minRating: null,
    });
  }, []);

  // Методы для фильтрации глубины и видимости
  const setMaxDepthFilter = useCallback((maxDepth: number | null) => {
    setActiveFilters((prev) => ({ ...prev, maxDepth }));
  }, []);

  const setMinVisibilityFilter = useCallback((minVisibility: number | null) => {
    setActiveFilters((prev) => ({ ...prev, minVisibility }));
  }, []);

  // Метод для фильтрации по рейтингу
  const setMinRatingFilter = useCallback((minRating: number | null) => {
    setActiveFilters((prev) => ({ ...prev, minRating }));
  }, []);

  // Отфильтрованные дайв-сайты
  const filteredDiveSites = useMemo(() => {
    let filtered = diveSites;

    if (activeFilters.siteTypeIds.length > 0) {
      filtered = filtered.filter((site) => activeFilters.siteTypeIds.includes(site.site_type_id));
    }

    if (activeFilters.difficultyIds.length > 0) {
      filtered = filtered.filter((site) =>
        activeFilters.difficultyIds.includes(site.difficulty_id),
      );
    }

    if (activeFilters.maxDepth !== null) {
      filtered = filtered.filter((site) => site.depth_max <= activeFilters.maxDepth!);
    }

    if (activeFilters.minVisibility !== null) {
      filtered = filtered.filter((site) => site.visibility >= activeFilters.minVisibility!);
    }

    if (activeFilters.minRating !== null) {
      filtered = filtered.filter((site) => site.rating >= activeFilters.minRating!);
    }

    return filtered;
  }, [
    diveSites,
    activeFilters.siteTypeIds,
    activeFilters.difficultyIds,
    activeFilters.maxDepth,
    activeFilters.minVisibility,
    activeFilters.minRating,
  ]);

  const value = useMemo(
    () => ({
      map,
      isLoaded,
      diveSites,
      filteredDiveSites,
      selectedSite,
      loading,
      error,
      autocompleteInfoMessage,
      activeFilters,
      setMap,
      setLoaded,
      fetchDiveSites,
      selectSite,
      onSiteClick,
      onClusterClick,
      centerOnSelection,
      clearAutocompleteInfoMessage,
      setSiteTypeFilter,
      setDifficultyFilter,
      setMaxDepthFilter,
      setMinVisibilityFilter,
      setMinRatingFilter,
      clearFilters,
    }),
    [
      map,
      isLoaded,
      diveSites,
      filteredDiveSites,
      selectedSite,
      loading,
      error,
      autocompleteInfoMessage,
      activeFilters,
      fetchDiveSites,
      selectSite,
      onSiteClick,
      onClusterClick,
      centerOnSelection,
      clearAutocompleteInfoMessage,
      setSiteTypeFilter,
      setDifficultyFilter,
      setMaxDepthFilter,
      setMinVisibilityFilter,
      setMinRatingFilter,
      clearFilters,
    ],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMap must be used within MapProvider');
  return ctx;
}
