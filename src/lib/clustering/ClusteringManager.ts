import { Site } from '@/types/database'; // Импортируем тип дайв-сайта из базы данных
import {
  Cluster, // Тип кластера - группа близко расположенных точек
  BoundingBox, // Тип ограничивающего прямоугольника - границы видимой области
  ClusteringOptions, // Тип настроек кластеризации - конфигурация алгоритма
  PerformanceMetrics, // Тип метрик производительности - статистика работы
} from '@/types/clustering';

export class ClusteringManager {
  private options: ClusteringOptions; // Конфигурация кластеризации с настройками алгоритма
  private performanceMetrics: PerformanceMetrics; // Метрики производительности для мониторинга

  constructor(options: Partial<ClusteringOptions> = {}) {
    // Устанавливаем настройки по умолчанию с возможностью переопределения пользователем
    this.options = {
      minPoints: 2, // Минимальное количество точек для создания кластера (2+ точки = кластер)
      maxZoom: 16, // Максимальный уровень зума для кластеризации (выше этого зума - только отдельные маркеры)
      radius: 50, // Радиус кластеризации в пикселях (расстояние между точками для объединения)
      extent: 512, // Размер тайла карты в пикселях (стандартный размер тайла MapLibre)
      nodeSize: 64, // Размер узла для квадродерева (оптимизация для больших наборов данных)
      ...options, // Позволяет переопределить настройки по умолчанию при создании экземпляра
    };

    // Инициализируем метрики производительности для отслеживания эффективности
    this.performanceMetrics = {
      clusteringTime: 0, // Время выполнения кластеризации в миллисекундах (общее время алгоритма)
      renderTime: 0, // Время рендеринга в миллисекундах (время отрисовки на экране)
      memoryUsage: 0, // Использование памяти в байтах (текущее потребление памяти)
      frameRate: 0, // Частота кадров (FPS) - сколько кадров в секунду отрисовывается
      queryCount: 0, // Количество запросов к пространственному индексу (общее количество)
      averageQueryTime: 0, // Среднее время запроса в миллисекундах (среднее по всем запросам)
    };
  }

  /**
   * Основная функция кластеризации - группирует близко расположенные точки в кластеры
   * @param points - массив дайв-сайтов для кластеризации
   * @param bounds - границы видимой области карты
   * @param zoom - текущий уровень зума карты
   * @returns массив кластеров с группированными точками
   */
  public cluster(points: Site[], bounds: BoundingBox, zoom: number): Cluster[] {
    const startTime = performance.now(); // Засекаем время начала выполнения для метрик

    // Проверяем, нужно ли кластеризовать на данном уровне зума (высокий зум = отдельные маркеры)
    if (!this.shouldCluster(zoom)) {
      // Если не нужно кластеризовать, возвращаем пустой массив кластеров
      this.performanceMetrics.clusteringTime = performance.now() - startTime; // Обновляем время выполнения
      this.performanceMetrics.queryCount++; // Увеличиваем счетчик запросов
      return []; // Возвращаем пустой массив - все точки будут показаны как отдельные маркеры
    }

    // Вычисляем радиус кластеризации на основе зума
    const clusterRadius = this.calculateClusterRadius(zoom, bounds);

    // Выполняем distance-based кластеризацию
    const clusters = this.distanceBasedClustering(points, clusterRadius, zoom);

    // Обновляем метрики производительности для мониторинга эффективности
    this.performanceMetrics.clusteringTime = performance.now() - startTime; // Общее время выполнения
    this.performanceMetrics.queryCount++; // Увеличиваем счетчик выполненных операций

    return clusters; // Возвращаем массив кластеров для отображения на карте
  }

  /**
   * Вычисляет радиус кластеризации на основе уровня зума и размера области
   * @param zoom - уровень зума карты
   * @param bounds - границы видимой области
   * @returns радиус кластеризации в градусах
   */
  private calculateClusterRadius(zoom: number, bounds: BoundingBox): number {
    // Базовый радиус уменьшается с увеличением зума
    const baseRadius = Math.pow(2, 12 - zoom) * 0.01; // 0.01 градуса = примерно 1.1 км на экваторе

    // Адаптируем радиус к размеру видимой области
    const areaWidth = bounds.maxLng - bounds.minLng;
    const areaHeight = bounds.maxLat - bounds.minLat;
    const areaSize = Math.max(areaWidth, areaHeight);

    // Радиус должен быть пропорционален размеру области
    const adaptiveRadius = Math.min(baseRadius, areaSize * 0.05); // Уменьшили с 0.1 до 0.05

    // Минимальный и максимальный радиусы
    const minRadius = 0.003; // ~300 метров
    const maxRadius = 100; // ~10 км (уменьшили с 0.1)

    const finalRadius = Math.max(minRadius, Math.min(maxRadius, adaptiveRadius));

    // Отладочная информация
    if (process.env.NODE_ENV === 'development') {
      console.log('Cluster Radius Debug:', {
        zoom,
        baseRadius,
        areaSize,
        adaptiveRadius,
        finalRadius,
        bounds,
      });
    }

    return finalRadius;
  }

  /**
   * Выполняет distance-based кластеризацию точек
   * @param points - массив точек для кластеризации
   * @param radius - радиус кластеризации в градусах
   * @param zoom - уровень зума
   * @returns массив кластеров
   */
  private distanceBasedClustering(points: Site[], radius: number, zoom: number): Cluster[] {
    if (points.length === 0) return [];

    const clusters: Cluster[] = [];
    const visited = new Set<number>(); // Отслеживаем посещенные точки

    // Отладочная информация
    if (process.env.NODE_ENV === 'development') {
      console.log('Clustering Debug:', {
        totalPoints: points.length,
        radius,
        zoom,
        minPoints: this.options.minPoints,
      });
    }

    for (let i = 0; i < points.length; i++) {
      if (visited.has(i)) continue; // Пропускаем уже посещенные точки

      const clusterPoints: Site[] = [points[i]]; // Начинаем новый кластер с текущей точки
      visited.add(i);

      // Ищем все точки в радиусе от текущей точки
      for (let j = i + 1; j < points.length; j++) {
        if (visited.has(j)) continue;

        const distance = this.calculateDistance(points[i], points[j]);
        if (distance <= radius) {
          clusterPoints.push(points[j]);
          visited.add(j);
        }
      }

      // Создаем кластер только если достаточно точек
      if (clusterPoints.length >= this.options.minPoints) {
        const center = this.calculateClusterCenter(clusterPoints);
        const cluster: Cluster = {
          id: `cluster_${clusters.length}`,
          center: center,
          points: clusterPoints,
          count: clusterPoints.length,
          bounds: this.calculateClusterBounds(clusterPoints),
          level: zoom,
        };
        clusters.push(cluster);

        // Отладочная информация для каждого кластера
        if (process.env.NODE_ENV === 'development') {
          console.log(`Cluster ${clusters.length - 1}:`, {
            id: cluster.id,
            count: cluster.count,
            center: cluster.center,
            points: clusterPoints.map((p) => ({ id: p.id, coords: [p.longitude, p.latitude] })),
          });
        }
      }
    }

    // Финальная отладочная информация
    if (process.env.NODE_ENV === 'development') {
      console.log('Clustering Results:', {
        totalClusters: clusters.length,
        totalClusteredPoints: clusters.reduce((sum, c) => sum + c.count, 0),
        individualPoints: points.length - clusters.reduce((sum, c) => sum + c.count, 0),
        clusterSizes: clusters.map((c) => c.count),
      });
    }

    return clusters;
  }

  /**
   * Вычисляет расстояние между двумя точками в градусах
   * @param point1 - первая точка
   * @param point2 - вторая точка
   * @returns расстояние в градусах
   */
  private calculateDistance(point1: Site, point2: Site): number {
    const deltaLng = point1.longitude - point2.longitude;
    const deltaLat = point1.latitude - point2.latitude;
    return Math.sqrt(deltaLng * deltaLng + deltaLat * deltaLat);
  }

  /**
   * Вычисляет центр кластера как среднее координат всех точек
   * @param points - массив точек в кластере
   * @returns координаты центра [долгота, широта]
   */
  private calculateClusterCenter(points: Site[]): [number, number] {
    const sumLng = points.reduce((sum, p) => sum + p.longitude, 0);
    const sumLat = points.reduce((sum, p) => sum + p.latitude, 0);
    return [sumLng / points.length, sumLat / points.length];
  }

  /**
   * Вычисляет границы кластера
   * @param points - массив точек в кластере
   * @returns границы кластера
   */
  private calculateClusterBounds(points: Site[]): BoundingBox {
    const lngs = points.map((p) => p.longitude);
    const lats = points.map((p) => p.latitude);

    return {
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
    };
  }

  /**
   * Получает копию метрик производительности для мониторинга
   * @returns объект с метриками производительности (время, память, запросы)
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics }; // Возвращаем копию, чтобы избежать изменений извне
  }

  /**
   * Очищает кэш и освобождает память - вызывается при смене данных или перезагрузке
   */
  public cleanup(): void {
    // Сбрасываем метрики производительности
    this.performanceMetrics.clusteringTime = 0;
    this.performanceMetrics.renderTime = 0;
    this.performanceMetrics.memoryUsage = 0;
    this.performanceMetrics.frameRate = 0;
    this.performanceMetrics.queryCount = 0;
    this.performanceMetrics.averageQueryTime = 0;
  }

  /**
   * Проверяет, нужно ли кластеризовать на данном уровне зума
   * @param zoom - текущий уровень зума карты
   * @returns true если нужно кластеризовать, false если показывать отдельные маркеры
   */
  public shouldCluster(zoom: number): boolean {
    return zoom <= this.options.maxZoom; // Кластеризуем только если зум меньше или равен максимальному
  }

  /**
   * Получает минимальное количество точек для создания кластера
   * @returns минимальное количество точек в кластере
   */
  public getMinPoints(): number {
    return this.options.minPoints; // Возвращаем настройку минимального количества точек
  }
}
