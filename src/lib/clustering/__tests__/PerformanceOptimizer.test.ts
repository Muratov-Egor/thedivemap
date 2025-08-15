import {
  PerformanceOptimizer,
  ObjectPool,
  CacheManager,
  MemoryMonitor,
} from '../PerformanceOptimizer';

describe('PerformanceOptimizer', () => {
  let optimizer: PerformanceOptimizer;

  beforeEach(() => {
    optimizer = new PerformanceOptimizer();
  });

  describe('isInViewport', () => {
    it('возвращает true для точки в пределах видимой области', () => {
      const point = { latitude: 50, longitude: 30 };
      const bounds = { minLat: 40, maxLat: 60, minLng: 20, maxLng: 40 };

      const result = optimizer.isInViewport(point, bounds);

      expect(result).toBe(true);
    });

    it('возвращает false для точки вне видимой области', () => {
      const point = { latitude: 70, longitude: 50 };
      const bounds = { minLat: 40, maxLat: 60, minLng: 20, maxLng: 40 };

      const result = optimizer.isInViewport(point, bounds);

      expect(result).toBe(false);
    });

    it('возвращает true для точки на границе', () => {
      const point = { latitude: 40, longitude: 20 };
      const bounds = { minLat: 40, maxLat: 60, minLng: 20, maxLng: 40 };

      const result = optimizer.isInViewport(point, bounds);

      expect(result).toBe(true);
    });
  });

  describe('cullPoints', () => {
    it('фильтрует точки по видимой области', () => {
      const points = [
        { latitude: 50, longitude: 30, id: 1 },
        { latitude: 70, longitude: 50, id: 2 },
        { latitude: 45, longitude: 25, id: 3 },
      ];
      const bounds = { minLat: 40, maxLat: 60, minLng: 20, maxLng: 40 };

      const result = optimizer.cullPoints(points, bounds);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { latitude: 50, longitude: 30, id: 1 },
        { latitude: 45, longitude: 25, id: 3 },
      ]);
    });

    it('возвращает пустой массив для пустого входного массива', () => {
      const points: Array<{ latitude: number; longitude: number }> = [];
      const bounds = { minLat: 40, maxLat: 60, minLng: 20, maxLng: 40 };

      const result = optimizer.cullPoints(points, bounds);

      expect(result).toEqual([]);
    });

    it('возвращает все точки если они все в видимой области', () => {
      const points = [
        { latitude: 50, longitude: 30, id: 1 },
        { latitude: 45, longitude: 25, id: 2 },
      ];
      const bounds = { minLat: 40, maxLat: 60, minLng: 20, maxLng: 40 };

      const result = optimizer.cullPoints(points, bounds);

      expect(result).toHaveLength(2);
      expect(result).toEqual(points);
    });
  });
});

describe('ObjectPool', () => {
  let pool: ObjectPool<{ id: number; data: string }>;

  beforeEach(() => {
    pool = new ObjectPool(
      () => ({ id: 0, data: '' }),
      (obj) => {
        obj.id = 0;
        obj.data = '';
      },
    );
  });

  describe('acquire', () => {
    it('создает новый объект если пул пуст', () => {
      const obj = pool.acquire();

      expect(obj).toEqual({ id: 0, data: '' });
      expect(pool.size).toBe(0);
    });

    it('возвращает объект из пула если он не пуст', () => {
      const obj1 = pool.acquire();
      obj1.id = 1;
      obj1.data = 'test';

      pool.release(obj1);

      const obj2 = pool.acquire();

      expect(obj2).toEqual({ id: 0, data: '' }); // reset
      expect(pool.size).toBe(0);
    });
  });

  describe('release', () => {
    it('возвращает объект в пул и сбрасывает его', () => {
      const obj = pool.acquire();
      obj.id = 1;
      obj.data = 'test';

      pool.release(obj);

      expect(pool.size).toBe(1);

      const releasedObj = pool.acquire();
      expect(releasedObj).toEqual({ id: 0, data: '' });
    });
  });

  describe('clear', () => {
    it('очищает пул', () => {
      const obj = pool.acquire();
      pool.release(obj);

      expect(pool.size).toBe(1);

      pool.clear();

      expect(pool.size).toBe(0);
    });
  });

  describe('size', () => {
    it('возвращает правильный размер пула', () => {
      expect(pool.size).toBe(0);

      const obj1 = pool.acquire();
      const obj2 = pool.acquire();

      pool.release(obj1);
      expect(pool.size).toBe(1);

      pool.release(obj2);
      expect(pool.size).toBe(2);
    });
  });
});

describe('CacheManager', () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = new CacheManager();
  });

  describe('set', () => {
    it('сохраняет данные в кэш', () => {
      const data = { test: 'value' };
      cache.set('test-key', data, 60000);

      expect(cache.get('test-key')).toEqual(data);
    });

    it('использует дефолтный TTL', () => {
      const data = { test: 'value' };
      cache.set('test-key', data);

      expect(cache.get('test-key')).toEqual(data);
    });
  });

  describe('get', () => {
    it('возвращает данные из кэша', () => {
      const data = { test: 'value' };
      cache.set('test-key', data, 60000);

      const result = cache.get('test-key');
      expect(result).toEqual(data);
    });

    it('возвращает null для несуществующего ключа', () => {
      const result = cache.get('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('has', () => {
    it('возвращает true для существующего ключа', () => {
      cache.set('test-key', 'value', 60000);

      expect(cache.has('test-key')).toBe(true);
    });

    it('возвращает false для несуществующего ключа', () => {
      expect(cache.has('non-existent')).toBe(false);
    });
  });

  describe('delete', () => {
    it('удаляет ключ из кэша', () => {
      cache.set('test-key', 'value', 60000);

      expect(cache.delete('test-key')).toBe(true);
      expect(cache.get('test-key')).toBeNull();
    });

    it('возвращает false для несуществующего ключа', () => {
      expect(cache.delete('non-existent')).toBe(false);
    });
  });

  describe('clear', () => {
    it('очищает весь кэш', () => {
      cache.set('key1', 'value1', 60000);
      cache.set('key2', 'value2', 60000);

      cache.clear();

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
      expect(cache.size).toBe(0);
    });
  });

  describe('size', () => {
    it('возвращает правильный размер кэша', () => {
      expect(cache.size).toBe(0);

      cache.set('key1', 'value1', 60000);
      expect(cache.size).toBe(1);

      cache.set('key2', 'value2', 60000);
      expect(cache.size).toBe(2);

      cache.delete('key1');
      expect(cache.size).toBe(1);
    });
  });
});

describe('MemoryMonitor', () => {
  let monitor: MemoryMonitor;

  beforeEach(() => {
    monitor = new MemoryMonitor();
  });

  describe('measureMemory', () => {
    it('возвращает 0 если performance.memory недоступен', () => {
      const result = monitor.measureMemory();
      expect(result).toBe(0);
    });
  });

  describe('addMeasurement', () => {
    it('добавляет измерение в список', () => {
      monitor.addMeasurement();
      expect(monitor.getAverageMemory()).toBe(0);
    });
  });

  describe('getAverageMemory', () => {
    it('возвращает 0 для пустого списка измерений', () => {
      const result = monitor.getAverageMemory();
      expect(result).toBe(0);
    });
  });

  describe('getMaxMemory', () => {
    it('возвращает 0 для пустого списка измерений', () => {
      const result = monitor.getMaxMemory();
      expect(result).toBe(0);
    });
  });

  describe('clear', () => {
    it('очищает все измерения', () => {
      monitor.addMeasurement();
      expect(monitor.getAverageMemory()).toBe(0);

      monitor.clear();
      expect(monitor.getAverageMemory()).toBe(0);
      expect(monitor.getMaxMemory()).toBe(0);
    });
  });
});
