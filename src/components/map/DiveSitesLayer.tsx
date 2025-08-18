'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map } from 'maplibre-gl';
import { Site } from '@/types/database';
import { Cluster, BoundingBox } from '@/types/clustering';
import { ClusteringManager } from '@/lib/clustering/ClusteringManager';
import { PerformanceOptimizer } from '@/lib/clustering/PerformanceOptimizer';
import DiveSiteMarker from './DiveSiteMarker';
import MarkerCluster from './MarkerCluster';

interface DiveSitesLayerProps {
  map: Map | null;
  sites: Site[];
  selectedSite: Site | null;
  onSiteClick?: (site: Site) => void;
  onClusterClick?: (cluster: Cluster) => void;
}

export default function DiveSitesLayer({
  map,
  sites,
  selectedSite,
  onSiteClick,
  onClusterClick,
}: DiveSitesLayerProps) {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [individualSites, setIndividualSites] = useState<Site[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Сбрасываем состояние кластеризации если нет данных
  useEffect(() => {
    if (!sites || sites.length === 0) {
      setClusters([]);
      setIndividualSites([]);
      return;
    }
  }, [sites]);

  const clusteringManagerRef = useRef<ClusteringManager | null>(null);
  const performanceOptimizerRef = useRef<PerformanceOptimizer | null>(null);
  const lastSitesRef = useRef<Site[]>([]);

  // Инициализация менеджеров
  useEffect(() => {
    if (!clusteringManagerRef.current) {
      clusteringManagerRef.current = new ClusteringManager({
        minPoints: 2,
        maxZoom: 12,
        radius: 50,
      });
    }

    if (!performanceOptimizerRef.current) {
      performanceOptimizerRef.current = new PerformanceOptimizer();
    }
  }, []);

  // Получение границ карты
  const getMapBounds = useCallback((): BoundingBox | null => {
    if (!map) return null;

    const bounds = map.getBounds();
    return {
      minLng: bounds.getWest(),
      maxLng: bounds.getEast(),
      minLat: bounds.getSouth(),
      maxLat: bounds.getNorth(),
    };
  }, [map]);

  // Получение текущего зума
  const getCurrentZoom = useCallback((): number => {
    return map ? map.getZoom() : 0;
  }, [map]);

  // Проверка видимости точки на карте
  const isPointVisible = useCallback(
    (lng: number, lat: number): boolean => {
      if (!map) return false;

      const bounds = map.getBounds();
      return (
        lng >= bounds.getWest() &&
        lng <= bounds.getEast() &&
        lat >= bounds.getSouth() &&
        lat <= bounds.getNorth()
      );
    },
    [map],
  );

  // Проверка, изменились ли сайты (для оптимизации)
  const hasSitesChanged = useCallback((newSites: Site[]): boolean => {
    if (lastSitesRef.current.length !== newSites.length) {
      return true;
    }

    // Проверяем, изменились ли ID сайтов
    const oldIds = new Set(lastSitesRef.current.map((site) => site.id));
    const newIds = new Set(newSites.map((site) => site.id));

    if (oldIds.size !== newIds.size) {
      return true;
    }

    for (const id of oldIds) {
      if (!newIds.has(id)) {
        return true;
      }
    }

    return false;
  }, []);

  // Вынесенная функция для выполнения обновления кластеризации
  const performClusteringUpdate = useCallback(() => {
    if (!map || !clusteringManagerRef.current || sites.length === 0) {
      return;
    }

    setIsUpdating(true);

    try {
      const bounds = getMapBounds();
      const zoom = getCurrentZoom();

      if (!bounds) {
        return;
      }

      if (clusteringManagerRef.current) {
        const newClusters = clusteringManagerRef.current.cluster(sites, bounds, zoom);
        setClusters(newClusters);

        // Определяем, какие сайты показывать индивидуально на основе уровня зума
        const shouldShowIndividual = zoom > 12;

        if (shouldShowIndividual) {
          // На высоком зуме показываем все сайты как отдельные маркеры
          setIndividualSites(sites);
        } else {
          // На среднем и низком зуме показываем сайты, которые не попали в кластеры
          const clusteredSiteIds = new Set();
          newClusters.forEach((cluster) => {
            cluster.points.forEach((site) => {
              clusteredSiteIds.add(site.id);
            });
          });

          // Фильтруем сайты, которые не попали в кластеры
          const individualSitesToShow = sites.filter((site) => !clusteredSiteIds.has(site.id));
          setIndividualSites(individualSitesToShow);
        }

        // Обновляем ссылку на последние сайты
        lastSitesRef.current = [...sites];
      }
    } catch (error) {
      console.error('Error during clustering:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [map, sites, getMapBounds, getCurrentZoom]);

  // Обновление кластеризации
  const updateClustering = useCallback(() => {
    if (!map || !clusteringManagerRef.current || sites.length === 0) {
      return;
    }

    // Проверяем, изменились ли сайты
    const sitesChanged = hasSitesChanged(sites);

    // Если сайты не изменились и мы уже обновляемся, пропускаем
    if (!sitesChanged && isUpdating) {
      return;
    }

    const bounds = getMapBounds();

    if (!bounds) {
      return;
    }

    // Для изменений фильтров (изменение sites) выполняем обновление немедленно
    // Для движений карты используем throttling
    const shouldThrottle = !sitesChanged;

    if (shouldThrottle && performanceOptimizerRef.current) {
      // Throttling только для движений карты
      const throttledUpdate = performanceOptimizerRef.current.throttle(() => {
        performClusteringUpdate();
      }, 100);
      throttledUpdate();
    } else {
      // Немедленное обновление для изменений фильтров
      performClusteringUpdate();
    }
  }, [map, sites, getMapBounds, hasSitesChanged, isUpdating, performClusteringUpdate]);

  // Обработка событий карты
  useEffect(() => {
    if (!map) return;

    const handleMapMove = () => {
      updateClustering();
    };

    const handleMapZoom = () => {
      updateClustering();
    };

    map.on('move', handleMapMove);
    map.on('zoom', handleMapZoom);

    return () => {
      map.off('move', handleMapMove);
      map.off('zoom', handleMapZoom);
    };
  }, [map, updateClustering]);

  // Обновление при изменении данных (включая фильтры)
  useEffect(() => {
    if (sites.length === 0) {
      setClusters([]);
      setIndividualSites([]);
      lastSitesRef.current = [];
      return;
    }

    // Принудительное обновление при изменении sites (фильтров)
    performClusteringUpdate();
  }, [sites, performClusteringUpdate]);

  // Обработка клика по сайту
  const handleSiteClick = useCallback(
    (site: Site) => {
      onSiteClick?.(site);
      console.log('Site clicked:', site);
    },
    [onSiteClick],
  );

  // Обработка клика по кластеру
  const handleClusterClick = useCallback(
    (cluster: Cluster) => {
      onClusterClick?.(cluster);

      // Зумируем к кластеру
      if (map) {
        const bounds = [
          [cluster.bounds.minLng, cluster.bounds.minLat],
          [cluster.bounds.maxLng, cluster.bounds.maxLat],
        ] as [[number, number], [number, number]];

        map.fitBounds(bounds, {
          padding: 50,
          duration: 500,
        });
      }
    },
    [map, onClusterClick],
  );

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      clusteringManagerRef.current?.cleanup();
    };
  }, []);

  if (!map) return null;

  return (
    <>
      {/* Индивидуальные маркеры дайв-сайтов */}
      {individualSites
        .filter((site) => isPointVisible(site.longitude, site.latitude))
        .map((site) => (
          <div
            key={site.id}
            className="absolute"
            style={{
              left: map.project([site.longitude, site.latitude]).x - 16,
              top: map.project([site.longitude, site.latitude]).y - 16,
            }}
          >
            <DiveSiteMarker
              site={site}
              onClick={handleSiteClick}
              isActive={selectedSite?.id === site.id}
            />
          </div>
        ))}

      {/* Кластеризованные маркеры */}
      {clusters
        .filter((cluster) => isPointVisible(cluster.center[0], cluster.center[1]))
        .map((cluster) => (
          <div
            key={cluster.id}
            className="absolute"
            style={{
              left: map.project(cluster.center).x - 20,
              top: map.project(cluster.center).y - 20,
            }}
          >
            <MarkerCluster cluster={cluster} onClick={handleClusterClick} />
          </div>
        ))}
    </>
  );
}
