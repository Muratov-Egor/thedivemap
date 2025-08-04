import { vi, beforeAll, afterAll } from 'vitest';
import type { Site, SiteWithDetails } from '@/types/database';

// Глобальная настройка для всех тестов
beforeAll(() => {
  // Мокаем console.error для подавления логов в тестах
  vi.spyOn(console, 'error').mockImplementation(() => {});

  // Мокаем console.log для подавления логов в тестах
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  // Восстанавливаем оригинальные методы
  vi.restoreAllMocks();
});

// Глобальные моки для Next.js
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data: unknown, options?: { status?: number }) => ({
      status: options?.status || 200,
      json: () => Promise.resolve(data),
      headers: new Map(),
    })),
  },
}));

// Глобальные моки для Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// ===== УТИЛИТЫ ДЛЯ API ТЕСТОВ =====

// Общие моки для Supabase
export const mockSupabaseResponse = {
  success: <T>(data: T) => ({
    data,
    error: null,
  }),
  error: (message: string) => ({
    data: null,
    error: { message },
  }),
};

// Общие моки для NextResponse
export const mockNextResponse = {
  success: <T>(data: T) => ({
    status: 200,
    json: () => Promise.resolve(data),
  }),
  error: (error: string, status: number = 500) => ({
    status,
    json: () => Promise.resolve({ error }),
  }),
};

// Тестовые данные для дайв-сайтов
export const testSites: SiteWithDetails[] = [
  {
    id: '71e9c9ae-4295-4a37-b1ca-223a85edf0ab',
    name: 'Mogren Cove',
    description: null,
    latitude: 42.2741953,
    longitude: 18.8301825,
    country_id: 113,
    depth_max: 30,
    visibility: 15,
    info_links: ['https://www.diversnotes.com/ru/blog/montenegro-expectations-vs-reality'],
    dive_center_links: null,
    created_at: '2025-07-19T16:23:58.978707+00:00',
    rating: 4,
    site_type_id: 3,
    difficulty_id: 1,
    status: 'published',
    country: {
      id: 113,
      name_en: 'Montenegro',
      name_ru: 'Черногория',
      iso_code: 'ME',
      region_id: 3,
    },
    site_type: {
      id: 3,
      label_en: 'Cave',
      label_ru: 'Пещера',
    },
    difficulty: {
      id: 1,
      label_en: 'Beginner',
      label_ru: 'Новичок',
    },
  },
  {
    id: 'b1ac03ab-d766-4606-83a8-37f86eda9d3f',
    name: 'Homerun Reef',
    description: '',
    latitude: 7.614699,
    longitude: 98.379049,
    country_id: 170,
    depth_max: 24,
    visibility: 10,
    info_links: ['https://www.idcphuket.com/scuba-diving/homerun-reef-racha-yai/'],
    dive_center_links: ['https://seastar.pro/'],
    created_at: '2025-07-06T10:08:05.809658+00:00',
    rating: 4,
    site_type_id: 1,
    difficulty_id: 1,
    status: 'published',
    country: {
      id: 170,
      name_en: 'Thailand',
      name_ru: 'Таиланд',
      iso_code: 'TH',
      region_id: 2,
    },
    site_type: {
      id: 1,
      label_en: 'Reef',
      label_ru: 'Риф',
    },
    difficulty: {
      id: 1,
      label_en: 'Beginner',
      label_ru: 'Новичок',
    },
  },
  {
    id: 'e78ebfa4-52c9-4189-8345-f8a3862a8697',
    name: "Bay 3 (Lucy's Reef)",
    description: '',
    latitude: 7.60549,
    longitude: 98.377418,
    country_id: 170,
    depth_max: 25,
    visibility: 15,
    info_links: ['https://www.diversnotes.com/ru/blog/racha-yai'],
    dive_center_links: ['https://seastar.pro/'],
    created_at: '2025-07-06T10:08:05.809658+00:00',
    rating: 0,
    site_type_id: 1,
    difficulty_id: 1,
    status: 'draft',
    country: {
      id: 170,
      name_en: 'Thailand',
      name_ru: 'Таиланд',
      iso_code: 'TH',
      region_id: 2,
    },
    site_type: {
      id: 1,
      label_en: 'Reef',
      label_ru: 'Риф',
    },
    difficulty: {
      id: 1,
      label_en: 'Beginner',
      label_ru: 'Новичок',
    },
  },
];

// Утилиты для создания тестовых данных
export const createTestSite = (overrides: Partial<SiteWithDetails> = {}) => ({
  ...testSites[0],
  ...overrides,
});

export const createTestSites = (count: number): SiteWithDetails[] =>
  Array.from({ length: count }, (_, index) =>
    createTestSite({
      id: `site-${index + 1}`,
      name: `Site ${index + 1}`,
    }),
  );

// Утилиты для валидации
export const validateSiteData = (site: unknown): site is Site => {
  return (
    typeof site === 'object' &&
    site !== null &&
    typeof (site as Site).id === 'string' &&
    typeof (site as Site).name === 'string' &&
    ((site as Site).description === null || typeof (site as Site).description === 'string') &&
    typeof (site as Site).latitude === 'number' &&
    typeof (site as Site).longitude === 'number' &&
    typeof (site as Site).country_id === 'number' &&
    typeof (site as Site).depth_max === 'number' &&
    typeof (site as Site).visibility === 'number' &&
    Array.isArray((site as Site).info_links) &&
    ((site as Site).dive_center_links === null ||
      Array.isArray((site as Site).dive_center_links)) &&
    typeof (site as Site).rating === 'number' &&
    typeof (site as Site).site_type_id === 'number' &&
    typeof (site as Site).difficulty_id === 'number' &&
    ['draft', 'published', 'rejected'].includes((site as Site).status)
  );
};

// Утилиты для проверки координат
export const validateCoordinates = (latitude: number, longitude: number): boolean => {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

// Утилиты для проверки рейтинга
export const validateRating = (rating: number): boolean => {
  return rating >= 0 && rating <= 5;
};
