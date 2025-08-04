import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/api/dive-sites/route';
import { supabase } from '@/lib/supabase';
import type { SiteWithDetails } from '@/types/database';

describe('Dive Sites API Performance Tests', () => {
  const mockSupabase = vi.mocked(supabase);

  it('должен обрабатывать запросы в разумное время', async () => {
    const startTime = Date.now();

    // Мокаем быстрый ответ от Supabase
    const mockSelect = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    await GET();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Проверяем, что запрос обрабатывается менее чем за 1 секунду
    expect(duration).toBeLessThan(1000);
  });

  it('должен эффективно обрабатывать большие объемы данных', async () => {
    // Создаем большой массив тестовых данных
    const largeDataset: SiteWithDetails[] = Array.from({ length: 1000 }, (_, index) => ({
      id: `site-${index}`,
      name: `Site ${index}`,
      description: `Description for site ${index}`,
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
      country_id: Math.floor(Math.random() * 100) + 1,
      depth_max: Math.floor(Math.random() * 50) + 5,
      visibility: Math.floor(Math.random() * 30) + 5,
      info_links: [`https://example${index}.com`],
      dive_center_links: [`https://divecenter${index}.com`],
      rating: Math.random() * 5,
      site_type_id: Math.floor(Math.random() * 10) + 1,
      difficulty_id: Math.floor(Math.random() * 5) + 1,
      status: 'published',
      country: {
        id: Math.floor(Math.random() * 100) + 1,
        name_en: `Country ${index}`,
        name_ru: `Страна ${index}`,
        region_id: Math.floor(Math.random() * 20) + 1,
        iso_code: `C${index.toString().padStart(2, '0')}`,
      },
      site_type: {
        id: Math.floor(Math.random() * 10) + 1,
        label_en: `Type ${index}`,
        label_ru: `Тип ${index}`,
      },
      difficulty: {
        id: Math.floor(Math.random() * 5) + 1,
        label_en: `Difficulty ${index}`,
        label_ru: `Сложность ${index}`,
      },
    }));

    const startTime = Date.now();

    // Мокаем ответ с большим объемом данных
    const mockSelect = vi.fn().mockResolvedValue({
      data: largeDataset,
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    const response = await GET();
    const data = await response.json();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Проверяем, что большой объем данных обрабатывается менее чем за 2 секунды
    expect(duration).toBeLessThan(2000);
    expect(data.length).toBe(1000);
  });

  it('должен обрабатывать множественные одновременные запросы', async () => {
    const numberOfRequests = 10;
    const requests = Array.from({ length: numberOfRequests }, () => GET());

    const startTime = Date.now();

    // Мокаем быстрый ответ для всех запросов
    const mockSelect = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    const responses = await Promise.all(requests);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Проверяем, что все запросы обработаны
    expect(responses).toHaveLength(numberOfRequests);

    // Проверяем, что все запросы обработаны в разумное время
    expect(duration).toBeLessThan(3000);
  });

  it('должен эффективно обрабатывать ошибки без задержек', async () => {
    const startTime = Date.now();

    // Мокаем быструю ошибку
    const mockSelect = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Quick error' },
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    const response = await GET();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Проверяем, что ошибка обрабатывается быстро
    expect(duration).toBeLessThan(500);
    expect(response.status).toBe(500);
  });

  it('должен поддерживать стабильную производительность при повторных запросах', async () => {
    const durations: number[] = [];
    const numberOfTests = 5;

    // Мокаем стабильный ответ
    const mockSelect = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    for (let i = 0; i < numberOfTests; i++) {
      const startTime = Date.now();
      await GET();
      const endTime = Date.now();
      durations.push(endTime - startTime);
    }

    // Проверяем, что все запросы обработаны в разумное время
    durations.forEach((duration) => {
      expect(duration).toBeLessThan(1000);
    });

    // Проверяем стабильность (разница между самым быстрым и самым медленным запросом)
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);
    const variance = maxDuration - minDuration;

    // Разница не должна быть слишком большой
    expect(variance).toBeLessThan(500);
  });
});
