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
  onSiteClick?: (site: Site) => void;
  onClusterClick?: (cluster: Cluster) => void;
}

export default function DiveSitesLayer({
  map,
  sites,
  onSiteClick,
  onClusterClick,
}: DiveSitesLayerProps) {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [individualSites, setIndividualSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  // Сбрасываем состояние кластеризации если нет данных
  useEffect(() => {
    if (!sites || sites.length === 0) {
      setClusters([]);
      setIndividualSites([]);
    }
  }, [sites]);

  const clusteringManagerRef = useRef<ClusteringManager | null>(null);
  const performanceOptimizerRef = useRef<PerformanceOptimizer | null>(null);

  // Инициализация менеджеров
  useEffect(() => {
    if (!clusteringManagerRef.current) {
      clusteringManagerRef.current = new ClusteringManager({
        minPoints: 2, // Минимальное количество точек для создания кластера (2+ точек = кластер)
        maxZoom: 12, // Максимальный зум для кластеризации (выше 12 - только отдельные маркеры)
        radius: 50, // Радиус кластеризации в пикселях (расстояние между точками для объединения)
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

  // Обновление кластеризации
  const updateClustering = useCallback(() => {
    if (!map || !clusteringManagerRef.current || sites.length === 0) {
      return;
    }

    const bounds = getMapBounds();
    const zoom = getCurrentZoom();

    if (!bounds) {
      return;
    }

    // Оптимизируем обновление кластеризации
    if (performanceOptimizerRef.current) {
      const throttledUpdate = performanceOptimizerRef.current.throttle(() => {
        try {
          if (clusteringManagerRef.current) {
            const newClusters = clusteringManagerRef.current.cluster(sites, bounds, zoom);
            setClusters(newClusters);

            // Определяем, какие сайты показывать индивидуально на основе уровня зума
            const shouldShowIndividual = zoom > 12; // Порог для показа всех сайтов как отдельных маркеров

            if (shouldShowIndividual) {
              // На высоком зуме (zoom > 12) показываем все сайты как отдельные маркеры
              setIndividualSites(sites); // Все сайты отображаются индивидуально
            } else {
              // На среднем и низком зуме показываем сайты, которые не попали в кластеры
              const clusteredSiteIds = new Set(); // Множество ID сайтов, которые уже в кластерах
              newClusters.forEach((cluster) => {
                cluster.points.forEach((site) => {
                  clusteredSiteIds.add(site.id); // Добавляем ID каждого сайта из кластера
                });
              });

              // Фильтруем сайты, которые не попали в кластеры (показываем их отдельно)
              const individualSitesToShow = sites.filter((site) => !clusteredSiteIds.has(site.id));
              setIndividualSites(individualSitesToShow);
            }
          }
        } catch (error) {
          console.error('Error during clustering:', error);
        }
      }, 100);

      throttledUpdate();
    } else {
      // Если нет оптимизатора, выполняем сразу
      try {
        if (clusteringManagerRef.current) {
          const newClusters = clusteringManagerRef.current.cluster(sites, bounds, zoom);
          setClusters(newClusters);
          setIndividualSites(
            sites.filter(
              (site) =>
                !newClusters.some((cluster) => cluster.points.some((p) => p.id === site.id)),
            ),
          );
        }
      } catch (error) {
        console.error('Error during clustering:', error);
      }
    }
  }, [map, sites, getMapBounds, getCurrentZoom]);

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

  // Обновление при изменении данных
  useEffect(() => {
    if (sites.length === 0) {
      setClusters([]);
      setIndividualSites([]);
      return;
    }
    updateClustering();
  }, [sites, updateClustering]);

  // Обработка клика по сайту
  const handleSiteClick = useCallback(
    (site: Site) => {
      setSelectedSite(site);
      onSiteClick?.(site);

      console.log(site);
    },
    [map, onSiteClick],
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
