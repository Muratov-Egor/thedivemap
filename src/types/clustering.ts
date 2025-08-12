// Типы для системы кластеризации маркеров дайв-сайтов

import { Site } from './database';

// Базовые типы для геометрии
export interface Point {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// Типы для кластеризации
export interface Cluster {
  id: string;
  center: [number, number]; // [longitude, latitude]
  points: Site[];
  count: number;
  bounds: BoundingBox;
  level: number; // Уровень кластеризации (zoom level)
}

export interface GridCell {
  id: string;
  bounds: BoundingBox;
  points: Site[];
  center: [number, number];
  count: number;
  level: number;
}

// Конфигурация кластеризации
export interface ClusteringOptions {
  minPoints: number; // Минимальное количество точек для кластера
  maxZoom: number; // Максимальный зум для кластеризации
  radius: number; // Радиус кластеризации в пикселях
  extent: number; // Размер тайла
  nodeSize: number; // Размер узла для квадродерева
}

// Состояние кластеризации
export interface ClusteringState {
  clusters: Cluster[];
  isClustering: boolean;
  lastUpdate: number;
  performance: {
    clusteringTime: number;
    renderTime: number;
    memoryUsage: number;
    frameRate: number;
  };
}

// События карты
export interface MapEvent {
  type: 'zoom' | 'pan' | 'move' | 'load';
  data: {
    zoom?: number;
    center?: [number, number];
    bounds?: BoundingBox;
  };
}

// Типы для маркеров
export interface MarkerProps {
  site: Site;
  onClick?: (site: Site) => void;
  onHover?: (site: Site) => void;
  isActive?: boolean;
}

export interface ClusterMarkerProps {
  cluster: Cluster;
  onClick?: (cluster: Cluster) => void;
  onHover?: (cluster: Cluster) => void;
  isActive?: boolean;
}

// Типы для информационных окон
export interface InfoWindowProps {
  site: Site;
  position: [number, number];
  onClose: () => void;
  isVisible: boolean;
}

// Типы для производительности
export interface PerformanceMetrics {
  clusteringTime: number;
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  queryCount: number;
  averageQueryTime: number;
}

// Типы для кэширования
export interface CacheEntry {
  key: string;
  data: unknown;
  timestamp: number;
  ttl: number; // Time to live в миллисекундах
}

export interface SpatialIndex {
  cells: Map<string, GridCell>;
  minCellSize: number;
  maxCellSize: number;
  targetPointsPerCell: number;
  insertions: number;
  queries: number;
  averageQueryTime: number;
}
