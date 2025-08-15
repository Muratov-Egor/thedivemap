/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { GET } from '../route';
import { supabase } from '@/lib/supabase';

// Мокаем NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.requireActual('next/server').NextRequest,
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: async () => data,
      status: options?.status || 200,
    })),
  },
}));

// Мокаем supabase с полной цепочкой методов
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            in: jest.fn(() => ({
              then: jest.fn((callback) => callback({ data: [], error: null })),
            })),
          })),
        })),
        gte: jest.fn(() => ({
          eq: jest.fn(() => ({
            in: jest.fn(() => ({
              then: jest.fn((callback) => callback({ data: [], error: null })),
            })),
          })),
        })),
        in: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              then: jest.fn((callback) => callback({ data: [], error: null })),
            })),
          })),
        })),
        then: jest.fn((callback) => callback({ data: [], error: null })),
      })),
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              in: jest.fn(() => ({
                then: jest.fn((callback) => callback({ data: [], error: null })),
              })),
            })),
          })),
        })),
        gte: jest.fn(() => ({
          eq: jest.fn(() => ({
            in: jest.fn(() => ({
              then: jest.fn((callback) => callback({ data: [], error: null })),
            })),
          })),
        })),
        in: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              then: jest.fn((callback) => callback({ data: [], error: null })),
            })),
          })),
        })),
        then: jest.fn((callback) => callback({ data: [], error: null })),
      })),
      gte: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              in: jest.fn(() => ({
                then: jest.fn((callback) => callback({ data: [], error: null })),
              })),
            })),
          })),
        })),
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            in: jest.fn(() => ({
              then: jest.fn((callback) => callback({ data: [], error: null })),
            })),
          })),
        })),
        in: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              then: jest.fn((callback) => callback({ data: [], error: null })),
            })),
          })),
        })),
        then: jest.fn((callback) => callback({ data: [], error: null })),
      })),
      in: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              then: jest.fn((callback) => callback({ data: [], error: null })),
            })),
          })),
        })),
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            then: jest.fn((callback) => callback({ data: [], error: null })),
          })),
        })),
        gte: jest.fn(() => ({
          eq: jest.fn(() => ({
            then: jest.fn((callback) => callback({ data: [], error: null })),
          })),
        })),
        then: jest.fn((callback) => callback({ data: [], error: null })),
      })),
    })),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Dive Sites API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (url: string): NextRequest => {
    return new NextRequest(url);
  };

  describe('GET /api/dive-sites', () => {
    describe('валидация параметров', () => {
      it('должен возвращать ошибку при невалидном UUID формате id', async () => {
        const request = createRequest('http://localhost:3000/api/dive-sites?id=invalid-uuid');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Invalid filter parameters');
        expect(data.details).toContain('Invalid site ID format');
      });

      it('должен возвращать ошибку при отрицательном country_id', async () => {
        const request = createRequest('http://localhost:3000/api/dive-sites?country_id=-1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Invalid filter parameters');
        expect(data.details).toContain('Invalid country_id: must be a positive number');
      });

      it('должен возвращать ошибку при невалидном status', async () => {
        const request = createRequest('http://localhost:3000/api/dive-sites?status=invalid');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Invalid filter parameters');
        expect(data.details).toContain('Invalid status: must be draft, published, or rejected');
      });

      it('должен возвращать ошибку при нечисловом depth_min', async () => {
        const request = createRequest('http://localhost:3000/api/dive-sites?depth_min=abc');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Invalid filter parameters');
        expect(data.details).toContain('Invalid depth_min: must be a positive number');
      });
    });

    describe('успешные запросы', () => {
      it('должен обрабатывать запрос без фильтров', async () => {
        const mockSites = [
          { id: '1', name: 'Site 1', country_id: 1 },
          { id: '2', name: 'Site 2', country_id: 1 },
        ];

        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockSites, error: null })),
        };

        mockSupabase.from.mockReturnValue(mockQuery as any);

        const request = createRequest('http://localhost:3000/api/dive-sites');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(mockSites);
        expect(mockSupabase.from).toHaveBeenCalledWith('sites');
      });

      it('должен применять фильтр по country_id', async () => {
        const mockSites = [{ id: '1', name: 'Site 1', country_id: 1 }];

        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockSites, error: null })),
        };

        mockSupabase.from.mockReturnValue(mockQuery as any);

        const request = createRequest('http://localhost:3000/api/dive-sites?country_id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(mockSites);
        expect(mockQuery.eq).toHaveBeenCalledWith('country_id', 1);
      });

      it('должен применять множественные фильтры', async () => {
        const mockSites: any[] = [];

        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockSites, error: null })),
        };

        mockSupabase.from.mockReturnValue(mockQuery as any);

        const request = createRequest(
          'http://localhost:3000/api/dive-sites?country_id=1&site_type_id=2&depth_min=10',
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(mockSites);
        expect(mockQuery.eq).toHaveBeenCalledWith('country_id', 1);
        expect(mockQuery.eq).toHaveBeenCalledWith('site_type_id', 2);
        expect(mockQuery.gte).toHaveBeenCalledWith('depth_max', 10);
      });
    });

    describe('фильтрация по региону', () => {
      it('должен фильтровать по region_id', async () => {
        const mockCountries = [{ id: 1 }, { id: 2 }];
        const mockSites = [{ id: '1', name: 'Site 1', country_id: 1 }];

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockCountries, error: null })),
        };

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockSites, error: null })),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockSitesQuery as any);

        const request = createRequest('http://localhost:3000/api/dive-sites?region_id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(mockSites);
        expect(mockSupabase.from).toHaveBeenCalledWith('countries');
        expect(mockSupabase.from).toHaveBeenCalledWith('sites');
      });
    });

    describe('фильтрация по локации', () => {
      it('должен фильтровать по location_id', async () => {
        const mockSiteLocations = [{ site_id: '1' }, { site_id: '2' }];
        const mockSites = [{ id: '1', name: 'Site 1' }];

        const mockSiteLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockSiteLocations, error: null })),
        };

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockSites, error: null })),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSiteLocationsQuery as any)
          .mockReturnValueOnce(mockSitesQuery as any);

        const request = createRequest('http://localhost:3000/api/dive-sites?location_id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(mockSites);
        expect(mockSupabase.from).toHaveBeenCalledWith('site_locations');
        expect(mockSupabase.from).toHaveBeenCalledWith('sites');
      });
    });

    describe('пустые параметры', () => {
      it('должен обрабатывать пустые параметры', async () => {
        const mockSites: any[] = [];

        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockSites, error: null })),
        };

        mockSupabase.from.mockReturnValue(mockQuery as any);

        const request = createRequest('http://localhost:3000/api/dive-sites?id=&country_id=');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(mockSites);
      });
    });

    describe('обработка ошибок', () => {
      it('должен обрабатывать ошибки базы данных', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((callback) =>
            callback({ data: null, error: { message: 'Database error' } }),
          ),
        };

        mockSupabase.from.mockReturnValue(mockQuery as any);

        const request = createRequest('http://localhost:3000/api/dive-sites');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Database error');
      });

      it('должен обрабатывать неожиданные ошибки', async () => {
        mockSupabase.from.mockImplementation(() => {
          throw new Error('Unexpected error');
        });

        const request = createRequest('http://localhost:3000/api/dive-sites');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to fetch dive sites');
      });
    });
  });
});
