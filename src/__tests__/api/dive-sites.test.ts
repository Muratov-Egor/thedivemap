import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/dive-sites/route';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { testSites } from '../setup';

describe('GET /api/dive-sites', () => {
  const mockSupabase = vi.mocked(supabase);
  const mockNextResponse = vi.mocked(NextResponse);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен возвращать список дайв-сайтов при успешном запросе', async () => {
    // Используем готовые тестовые данные
    const mockSites = testSites;

    // Настраиваем мок Supabase
    const mockSelect = vi.fn().mockResolvedValue({
      data: mockSites,
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    // Выполняем тест
    const response = await GET();

    // Проверяем, что Supabase был вызван правильно
    expect(mockSupabase.from).toHaveBeenCalledWith('sites');
    expect(mockSelect).toHaveBeenCalledWith(`
        *,
        country:countries(*),
        site_type:site_types(*),
        difficulty:difficulties(*)
      `);

    // Проверяем, что NextResponse.json был вызван с правильными данными
    expect(mockNextResponse.json).toHaveBeenCalledWith(mockSites);

    // Проверяем, что ответ существует и имеет правильную структуру
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  it('должен возвращать ошибку 500 при ошибке Supabase', async () => {
    // Настраиваем мок Supabase с ошибкой
    const mockSelect = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' },
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    // Выполняем тест
    const response = await GET();

    // Проверяем, что NextResponse.json был вызван с ошибкой
    expect(mockNextResponse.json).toHaveBeenCalledWith(
      { error: 'Database connection failed' },
      { status: 500 },
    );

    // Проверяем, что ответ имеет правильный статус
    expect(response.status).toBe(500);
  });

  it('должен возвращать ошибку 500 при исключении', async () => {
    // Настраиваем мок Supabase для выброса исключения
    const mockSelect = vi.fn().mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    // Выполняем тест
    const response = await GET();

    // Проверяем, что NextResponse.json был вызван с ошибкой
    expect(mockNextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to fetch dive sites' },
      { status: 500 },
    );

    // Проверяем, что ответ имеет правильный статус
    expect(response.status).toBe(500);
  });

  it('должен возвращать пустой массив при отсутствии данных', async () => {
    // Настраиваем мок Supabase с пустыми данными
    const mockSelect = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    // Выполняем тест
    const response = await GET();

    // Проверяем, что NextResponse.json был вызван с пустым массивом
    expect(mockNextResponse.json).toHaveBeenCalledWith([]);

    // Проверяем, что ответ имеет правильный статус
    expect(response.status).toBe(200);
  });
});
