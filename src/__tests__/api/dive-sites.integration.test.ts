import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/api/dive-sites/route';
import { supabase } from '@/lib/supabase';
import type { SiteWithDetails } from '@/types/database';

describe('Dive Sites API Integration Tests', () => {
  const mockSupabase = vi.mocked(supabase);

  it('должен возвращать правильный формат ответа', async () => {
    // Настраиваем мок Supabase
    const mockSelect = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    // Выполняем запрос к API
    const response = await GET();

    // Проверяем, что ответ существует
    expect(response).toBeDefined();

    // Проверяем, что это NextResponse
    expect(response).toHaveProperty('json');
    expect(response).toHaveProperty('status');
  });

  it('должен возвращать массив данных при успешном запросе', async () => {
    // Мокаем успешный ответ от Supabase
    const mockSites: SiteWithDetails[] = [
      {
        id: '1',
        name: 'Test Site 1',
        description: 'Test description 1',
        latitude: 0,
        longitude: 0,
        country_id: 1,
        depth_max: 20,
        visibility: 15,
        info_links: [],
        dive_center_links: [],
        rating: 4.0,
        site_type_id: 1,
        difficulty_id: 1,
        status: 'published',
        country: {
          id: 1,
          name_en: 'Test Country',
          name_ru: 'Тестовая страна',
          region_id: 1,
          iso_code: 'TC',
        },
        site_type: {
          id: 1,
          label_en: 'Test Type',
          label_ru: 'Тестовый тип',
        },
        difficulty: {
          id: 1,
          label_en: 'Easy',
          label_ru: 'Легкий',
        },
      },
    ];

    // Мокаем Supabase ответ
    const mockSelect = vi.fn().mockResolvedValue({
      data: mockSites,
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    const response = await GET();
    const data = await response.json();

    // Проверяем структуру ответа
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(0);
  });

  it('должен обрабатывать ошибки базы данных', async () => {
    // Мокаем ошибку Supabase
    const mockSelect = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' },
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    const response = await GET();
    const data = await response.json();

    // Проверяем, что возвращается ошибка
    expect(data).toHaveProperty('error');
    expect(response.status).toBe(500);
  });

  it('должен обрабатывать исключения', async () => {
    // Мокаем исключение
    const mockSelect = vi.fn().mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    const response = await GET();
    const data = await response.json();

    // Проверяем, что возвращается ошибка
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Failed to fetch dive sites');
    expect(response.status).toBe(500);
  });
});
