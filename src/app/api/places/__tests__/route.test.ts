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

// Мокаем supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Places API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (url: string): NextRequest => {
    return new NextRequest(url);
  };

  describe('GET /api/places', () => {
    describe('валидация параметров', () => {
      it('должен возвращать ошибку при отсутствии параметра q', async () => {
        const request = createRequest('http://localhost:3000/api/places');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Parameter "q" is required');
      });

      it('должен возвращать ошибку при пустом параметре q', async () => {
        const request = createRequest('http://localhost:3000/api/places?q=');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Parameter "q" is required');
      });

      it('должен использовать русский язык по умолчанию', async () => {
        const mockSites: any[] = [];
        const mockCountries: any[] = [];
        const mockRegions: any[] = [];
        const mockLocations: any[] = [];

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockCountries, error: null }),
        };

        const mockRegionsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockRegions, error: null }),
        };

        const mockLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockLocations, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSitesQuery as any)
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockRegionsQuery as any)
          .mockReturnValueOnce(mockLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/places?q=test');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.sites).toEqual(mockSites);
        expect(data.countries).toEqual(mockCountries);
        expect(data.regions).toEqual(mockRegions);
        expect(data.locations).toEqual(mockLocations);
      });

      it('должен использовать английский язык при lang=en', async () => {
        const mockSites: any[] = [];
        const mockCountries: any[] = [];
        const mockRegions: any[] = [];
        const mockLocations: any[] = [];

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockCountries, error: null }),
        };

        const mockRegionsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockRegions, error: null }),
        };

        const mockLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockLocations, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSitesQuery as any)
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockRegionsQuery as any)
          .mockReturnValueOnce(mockLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/places?q=test&lang=en');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.sites).toEqual(mockSites);
        expect(data.countries).toEqual(mockCountries);
        expect(data.regions).toEqual(mockRegions);
        expect(data.locations).toEqual(mockLocations);
      });
    });

    describe('поиск сайтов', () => {
      it('должен успешно искать сайты', async () => {
        const mockSites = [
          {
            id: 'site-1',
            name: 'Test Site',
            country: {
              name_ru: 'Россия',
              name_en: 'Russia',
              region: { name_ru: 'Европа', name_en: 'Europe' },
            },
            site_type: { label_ru: 'Риф', label_en: 'Reef' },
            site_locations: [{ location: { name_ru: 'Москва', name_en: 'Moscow' } }],
          },
        ];

        const mockCountries: any[] = [];
        const mockRegions: any[] = [];
        const mockLocations: any[] = [];

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockCountries, error: null }),
        };

        const mockRegionsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockRegions, error: null }),
        };

        const mockLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockLocations, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSitesQuery as any)
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockRegionsQuery as any)
          .mockReturnValueOnce(mockLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/places?q=test');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.sites).toEqual(mockSites);
        expect(mockSupabase.from).toHaveBeenCalledWith('sites');
        expect(mockSitesQuery.select).toHaveBeenCalledWith(`
          id,
          name,
          country:country_id(
            name_ru,
            region:region_id(name_ru)
          ),
          site_type:site_type_id(label_ru),
          site_locations(
            location:location_id(name_ru)
          )
        `);
        expect(mockSitesQuery.ilike).toHaveBeenCalledWith('name', '%test%');
        expect(mockSitesQuery.limit).toHaveBeenCalledWith(5);
      });

      it('должен обрабатывать ошибку при поиске сайтов', async () => {
        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: null, error: { message: 'Sites error' } }),
        };

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: [], error: null }),
        };

        const mockRegionsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: [], error: null }),
        };

        const mockLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: [], error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSitesQuery as any)
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockRegionsQuery as any)
          .mockReturnValueOnce(mockLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/places?q=test');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Search failed');
      });
    });

    describe('поиск стран', () => {
      it('должен успешно искать страны', async () => {
        const mockSites: any[] = [];
        const mockCountries = [
          { id: 1, name_ru: 'Россия', name_en: 'Russia', iso_code: 'RU' },
          { id: 2, name_ru: 'США', name_en: 'USA', iso_code: 'US' },
        ];

        const mockRegions: any[] = [];
        const mockLocations: any[] = [];

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockCountries, error: null }),
        };

        const mockRegionsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockRegions, error: null }),
        };

        const mockLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockLocations, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSitesQuery as any)
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockRegionsQuery as any)
          .mockReturnValueOnce(mockLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/places?q=россия');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.countries).toEqual([
          { id: 1, name_ru: 'Россия', name_en: 'Russia', iso_code: 'RU', name: 'Россия' },
          { id: 2, name_ru: 'США', name_en: 'USA', iso_code: 'US', name: 'США' },
        ]);
        expect(mockSupabase.from).toHaveBeenCalledWith('countries');
        expect(mockCountriesQuery.select).toHaveBeenCalledWith(
          'id, name_ru, name_en, iso_code, sites!inner(id)',
        );
        expect(mockCountriesQuery.or).toHaveBeenCalledWith(
          'name_ru.ilike.%россия%,name_en.ilike.%россия%',
        );
        expect(mockCountriesQuery.limit).toHaveBeenCalledWith(30); // 3 * 10 для дедупликации
      });

      it('должен возвращать только страны с дайв-сайтами и убирать дубликаты', async () => {
        const mockSites: any[] = [];
        // Имитируем дубликаты стран из-за inner join с sites
        const mockCountriesWithDuplicates = [
          { id: 1, name_ru: 'Россия', name_en: 'Russia', iso_code: 'RU', sites: [{ id: 'site1' }] },
          { id: 1, name_ru: 'Россия', name_en: 'Russia', iso_code: 'RU', sites: [{ id: 'site2' }] }, // дубликат
          { id: 2, name_ru: 'США', name_en: 'USA', iso_code: 'US', sites: [{ id: 'site3' }] },
        ];
        const mockRegions: any[] = [];
        const mockLocations: any[] = [];

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockCountriesWithDuplicates, error: null }),
        };

        const mockRegionsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockRegions, error: null }),
        };

        const mockLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockLocations, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSitesQuery as any)
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockRegionsQuery as any)
          .mockReturnValueOnce(mockLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/places?q=test');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        // Проверяем, что дубликаты удалены и остались только уникальные страны
        expect(data.countries).toEqual([
          { id: 1, name_ru: 'Россия', name_en: 'Russia', iso_code: 'RU', name: 'Россия' },
          { id: 2, name_ru: 'США', name_en: 'USA', iso_code: 'US', name: 'США' },
        ]);
        expect(data.countries).toHaveLength(2); // должно быть 2, а не 3 (дубликат удален)
      });

      it('должен обрабатывать ошибку при поиске стран', async () => {
        const mockSites: any[] = [];
        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: null, error: { message: 'Countries error' } }),
        };

        const mockRegions: any[] = [];
        const mockLocations: any[] = [];

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        const mockRegionsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockRegions, error: null }),
        };

        const mockLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockLocations, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSitesQuery as any)
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockRegionsQuery as any)
          .mockReturnValueOnce(mockLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/places?q=test');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.errors.countries).toBe('Countries error');
      });
    });

    describe('поиск регионов', () => {
      it('должен успешно искать регионы', async () => {
        const mockSites: any[] = [];
        const mockCountries: any[] = [];
        const mockRegions = [
          { id: 1, name_ru: 'Европа', name_en: 'Europe' },
          { id: 2, name_ru: 'Азия', name_en: 'Asia' },
        ];

        const mockLocations: any[] = [];

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockCountries, error: null }),
        };

        const mockRegionsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockRegions, error: null }),
        };

        const mockLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockLocations, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSitesQuery as any)
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockRegionsQuery as any)
          .mockReturnValueOnce(mockLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/places?q=европа');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.regions).toEqual([
          { id: 1, name_ru: 'Европа', name_en: 'Europe', name: 'Европа' },
          { id: 2, name_ru: 'Азия', name_en: 'Asia', name: 'Азия' },
        ]);
        expect(mockSupabase.from).toHaveBeenCalledWith('regions');
        expect(mockRegionsQuery.select).toHaveBeenCalledWith('id, name_ru, name_en');
        expect(mockRegionsQuery.or).toHaveBeenCalledWith(
          'name_ru.ilike.%европа%,name_en.ilike.%европа%',
        );
        expect(mockRegionsQuery.limit).toHaveBeenCalledWith(3);
      });
    });

    describe('поиск локаций', () => {
      it('должен успешно искать локации', async () => {
        const mockSites: any[] = [];
        const mockCountries: any[] = [];
        const mockRegions: any[] = [];
        const mockLocations = [
          { id: 1, name_ru: 'Москва', name_en: 'Moscow', country_id: 1, region_id: 1 },
          {
            id: 2,
            name_ru: 'Санкт-Петербург',
            name_en: 'Saint Petersburg',
            country_id: 1,
            region_id: 1,
          },
        ];

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockCountries, error: null }),
        };

        const mockRegionsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockRegions, error: null }),
        };

        const mockLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockLocations, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSitesQuery as any)
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockRegionsQuery as any)
          .mockReturnValueOnce(mockLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/places?q=москва');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.locations).toEqual([
          { id: 1, name: 'Москва', country_id: 1, region_id: 1 },
          { id: 2, name: 'Санкт-Петербург', country_id: 1, region_id: 1 },
        ]);
        expect(mockSupabase.from).toHaveBeenCalledWith('locations');
        expect(mockLocationsQuery.select).toHaveBeenCalledWith(
          'id, name_ru, name_en, country_id, region_id',
        );
        expect(mockLocationsQuery.or).toHaveBeenCalledWith(
          'name_ru.ilike.%москва%,name_en.ilike.%москва%',
        );
        expect(mockLocationsQuery.limit).toHaveBeenCalledWith(3);
      });
    });

    describe('локализация', () => {
      it('должен использовать английские поля при lang=en', async () => {
        const mockSites: any[] = [];
        const mockCountries: any[] = [];
        const mockRegions: any[] = [];
        const mockLocations: any[] = [];

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockCountries, error: null }),
        };

        const mockRegionsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockRegions, error: null }),
        };

        const mockLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: mockLocations, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSitesQuery as any)
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockRegionsQuery as any)
          .mockReturnValueOnce(mockLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/places?q=test&lang=en');
        await GET(request);

        expect(mockSitesQuery.select).toHaveBeenCalledWith(`
          id,
          name,
          country:country_id(
            name_en,
            region:region_id(name_en)
          ),
          site_type:site_type_id(label_en),
          site_locations(
            location:location_id(name_en)
          )
        `);
      });
    });

    describe('обработка исключений', () => {
      it('должен обрабатывать общие исключения', async () => {
        mockSupabase.from.mockImplementation(() => {
          throw new Error('Unexpected error');
        });

        const request = createRequest('http://localhost:3000/api/places?q=test');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Search failed');
      });
    });
  });
});
