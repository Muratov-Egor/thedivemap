// Утилиты для оптимизации производительности кластеризации

export class PerformanceOptimizer {
  private lastUpdate = 0;
  private updateQueue: (() => void)[] = [];
  private isProcessing = false;
  private frameCount = 0;
  private lastFrameTime = performance.now();

  /**
   * Ограничивает частоту выполнения функции
   */
  public throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number = 100,
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const now = performance.now();

      if (now - this.lastUpdate < delay) {
        // Ставим в очередь для выполнения позже
        this.updateQueue.push(() => func(...args));
        return;
      }

      this.lastUpdate = now;
      func(...args);

      // Обрабатываем очередь обновлений
      if (this.updateQueue.length > 0 && !this.isProcessing) {
        this.processQueue();
      }
    };
  }

  /**
   * Откладывает выполнение функции до окончания паузы
   */
  public debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number = 300,
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  /**
   * Обрабатывает очередь обновлений
   */
  private processQueue(): void {
    this.isProcessing = true;

    // Обрабатываем все обновления в очереди
    while (this.updateQueue.length > 0) {
      const updateFn = this.updateQueue.shift();
      if (updateFn) updateFn();
    }

    this.isProcessing = false;
  }

  /**
   * Начинает мониторинг частоты кадров
   */
  public startFrameRateMonitoring(): () => number {
    const measureFrame = () => {
      this.frameCount++;
      const currentTime = performance.now();

      if (currentTime - this.lastFrameTime >= 1000) {
        const frameRate = this.frameCount;
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
        return frameRate;
      }

      requestAnimationFrame(measureFrame);
      return 0;
    };

    requestAnimationFrame(measureFrame);
    return () => this.frameCount;
  }

  /**
   * Измеряет время выполнения функции
   */
  public measureTime<T>(fn: () => T): { result: T; time: number } {
    const start = performance.now();
    const result = fn();
    const time = performance.now() - start;
    return { result, time };
  }

  /**
   * Проверяет, находится ли точка в пределах видимой области
   */
  public isInViewport(
    point: { latitude: number; longitude: number },
    bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  ): boolean {
    return (
      point.longitude >= bounds.minLng &&
      point.longitude <= bounds.maxLng &&
      point.latitude >= bounds.minLat &&
      point.latitude <= bounds.maxLat
    );
  }

  /**
   * Фильтрует точки по видимой области
   */
  public cullPoints<T extends { latitude: number; longitude: number }>(
    points: T[],
    bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  ): T[] {
    return points.filter((point) => this.isInViewport(point, bounds));
  }
}

// Утилиты для объектного пула
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;

  constructor(createFn: () => T, resetFn: (obj: T) => void) {
    this.createFn = createFn;
    this.resetFn = resetFn;
  }

  /**
   * Получает объект из пула или создает новый
   */
  acquire(): T {
    return this.pool.pop() || this.createFn();
  }

  /**
   * Возвращает объект в пул
   */
  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }

  /**
   * Очищает пул
   */
  clear(): void {
    this.pool.length = 0;
  }

  /**
   * Получает размер пула
   */
  get size(): number {
    return this.pool.length;
  }
}

// Утилиты для кэширования
export class CacheManager {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  /**
   * Сохраняет данные в кэш
   */
  set(key: string, data: unknown, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Получает данные из кэша
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Проверяет наличие ключа в кэше
   */
  has(key: string): boolean {
    return this.cache.has(key) && !this.isExpired(key);
  }

  /**
   * Удаляет ключ из кэша
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Очищает весь кэш
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Очищает истекшие записи
   */
  cleanup(): void {
    for (const [key] of this.cache) {
      if (this.isExpired(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Проверяет, истек ли срок действия записи
   */
  private isExpired(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Получает размер кэша
   */
  get size(): number {
    return this.cache.size;
  }
}

// Утилиты для мониторинга памяти
export class MemoryMonitor {
  private measurements: number[] = [];
  private maxMeasurements = 100;

  /**
   * Измеряет использование памяти
   */
  measureMemory(): number {
    if ('memory' in performance) {
      const memory = (performance as { memory: { usedJSHeapSize: number } }).memory;
      return memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * Добавляет измерение памяти
   */
  addMeasurement(): void {
    const measurement = this.measureMemory();
    this.measurements.push(measurement);

    if (this.measurements.length > this.maxMeasurements) {
      this.measurements.shift();
    }
  }

  /**
   * Получает среднее использование памяти
   */
  getAverageMemory(): number {
    if (this.measurements.length === 0) return 0;
    const sum = this.measurements.reduce((a, b) => a + b, 0);
    return sum / this.measurements.length;
  }

  /**
   * Получает максимальное использование памяти
   */
  getMaxMemory(): number {
    return Math.max(...this.measurements, 0);
  }

  /**
   * Очищает измерения
   */
  clear(): void {
    this.measurements.length = 0;
  }
}
