import { ClusteringManager } from '../ClusteringManager';
import { Site } from '@/types/database';
import { BoundingBox } from '@/types/clustering';

describe('ClusteringManager', () => {
  let clusteringManager: ClusteringManager;
  const mockSites: Site[] = [
    {
      id: 1,
      name: 'Site 1',
      latitude: 10.0,
      longitude: 20.0,
      rating: 4.5,
      site_type: {
        label_en: 'Reef',
        label_ru: 'Риф',
      },
    },
    {
      id: 2,
      name: 'Site 2',
      latitude: 10.001,
      longitude: 20.001,
      rating: 4.0,
      site_type: {
        label_en: 'Wreck',
        label_ru: 'Затонувший корабль',
      },
    },
  ];

  const mockBounds: BoundingBox = {
    minLng: 19.0,
    maxLng: 22.0,
    minLat: 9.0,
    maxLat: 12.0,
  };

  beforeEach(() => {
    clusteringManager = new ClusteringManager();
  });

  describe('constructor', () => {
    it('создает экземпляр с настройками по умолчанию', () => {
      expect(clusteringManager).toBeInstanceOf(ClusteringManager);
      expect(clusteringManager.getMinPoints()).toBe(2);
    });

    it('принимает пользовательские настройки', () => {
      const customManager = new ClusteringManager({
        minPoints: 3,
        maxZoom: 14,
        radius: 100,
      });

      expect(customManager.getMinPoints()).toBe(3);
    });
  });

  describe('shouldCluster', () => {
    it('возвращает true для зума меньше или равного maxZoom', () => {
      expect(clusteringManager.shouldCluster(10)).toBe(true);
      expect(clusteringManager.shouldCluster(16)).toBe(true);
    });

    it('возвращает false для зума больше maxZoom', () => {
      expect(clusteringManager.shouldCluster(17)).toBe(false);
      expect(clusteringManager.shouldCluster(20)).toBe(false);
    });
  });

  describe('cluster', () => {
    it('возвращает пустой массив для высокого зума', () => {
      const result = clusteringManager.cluster(mockSites, mockBounds, 17);
      expect(result).toEqual([]);
    });

    it('возвращает пустой массив для пустого массива точек', () => {
      const result = clusteringManager.cluster([], mockBounds, 10);
      expect(result).toEqual([]);
    });

    it('создает кластеры для близко расположенных точек', () => {
      const result = clusteringManager.cluster(mockSites, mockBounds, 10);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('center');
      expect(result[0]).toHaveProperty('points');
      expect(result[0]).toHaveProperty('count');
      expect(result[0]).toHaveProperty('bounds');
      expect(result[0]).toHaveProperty('level');
    });

    it('не создает кластеры для недостаточного количества точек', () => {
      const customManager = new ClusteringManager({ minPoints: 5 });
      const result = customManager.cluster(mockSites, mockBounds, 10);
      expect(result).toEqual([]);
    });
  });

  describe('getPerformanceMetrics', () => {
    it('возвращает копию метрик производительности', () => {
      const metrics = clusteringManager.getPerformanceMetrics();

      expect(metrics).toHaveProperty('clusteringTime');
      expect(metrics).toHaveProperty('renderTime');
      expect(metrics).toHaveProperty('memoryUsage');
      expect(metrics).toHaveProperty('frameRate');
      expect(metrics).toHaveProperty('queryCount');
      expect(metrics).toHaveProperty('averageQueryTime');

      // Проверяем, что это копия, а не ссылка
      const metrics2 = clusteringManager.getPerformanceMetrics();
      expect(metrics).not.toBe(metrics2);
    });
  });

  describe('cleanup', () => {
    it('сбрасывает метрики производительности', () => {
      // Выполняем кластеризацию для генерации метрик
      clusteringManager.cluster(mockSites, mockBounds, 10);

      const metricsBefore = clusteringManager.getPerformanceMetrics();
      expect(metricsBefore.queryCount).toBeGreaterThan(0);

      clusteringManager.cleanup();

      const metricsAfter = clusteringManager.getPerformanceMetrics();
      expect(metricsAfter.queryCount).toBe(0);
      expect(metricsAfter.clusteringTime).toBe(0);
      expect(metricsAfter.renderTime).toBe(0);
      expect(metricsAfter.memoryUsage).toBe(0);
      expect(metricsAfter.frameRate).toBe(0);
      expect(metricsAfter.averageQueryTime).toBe(0);
    });
  });

  describe('getMinPoints', () => {
    it('возвращает минимальное количество точек', () => {
      expect(clusteringManager.getMinPoints()).toBe(2);
    });

    it('возвращает пользовательское значение', () => {
      const customManager = new ClusteringManager({ minPoints: 5 });
      expect(customManager.getMinPoints()).toBe(5);
    });
  });

  describe('граничные случаи', () => {
    it('обрабатывает очень большой массив точек', () => {
      const largeSites: Site[] = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Site ${i + 1}`,
        latitude: 10.0 + i * 0.001,
        longitude: 20.0 + i * 0.001,
        rating: 4.0,
        site_type: {
          label_en: 'Reef',
          label_ru: 'Риф',
        },
      }));

      const result = clusteringManager.cluster(largeSites, mockBounds, 10);

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((cluster) => cluster.count >= 2)).toBe(true);
    });

    it('обрабатывает точки с одинаковыми координатами', () => {
      const sameCoordSites = [
        mockSites[0],
        { ...mockSites[0], id: 4, name: 'Site 4' },
        { ...mockSites[0], id: 5, name: 'Site 5' },
      ];

      const result = clusteringManager.cluster(sameCoordSites, mockBounds, 10);

      expect(result.length).toBe(1);
      expect(result[0].count).toBe(3);
    });

    it('обрабатывает очень маленькие границы', () => {
      const smallBounds: BoundingBox = {
        minLng: 19.999,
        maxLng: 20.001,
        minLat: 9.999,
        maxLat: 10.001,
      };

      const result = clusteringManager.cluster(mockSites, smallBounds, 10);

      // Результат должен быть валидным
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
