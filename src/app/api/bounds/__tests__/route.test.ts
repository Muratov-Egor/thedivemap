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

describe('Bounds API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (url: string): NextRequest => {
    return new NextRequest(url);
  };

  describe('GET /api/bounds', () => {
    it('должен возвращать ошибку при отсутствии параметров', async () => {
      const request = createRequest('http://localhost:3000/api/bounds');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required parameters: type and id');
    });

    it('должен возвращать ошибку при отсутствии параметра type', async () => {
      const request = createRequest('http://localhost:3000/api/bounds?id=1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required parameters: type and id');
    });

    it('должен возвращать ошибку при отсутствии параметра id', async () => {
      const request = createRequest('http://localhost:3000/api/bounds?type=country');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required parameters: type and id');
    });

    it('должен возвращать ошибку при невалидном id', async () => {
      const request = createRequest('http://localhost:3000/api/bounds?type=country&id=invalid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid id parameter: must be a number');
    });

    it('должен возвращать ошибку при невалидном типе', async () => {
      const request = createRequest('http://localhost:3000/api/bounds?type=invalid&id=1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid type parameter: must be country, region, or location');
    });

    describe('фильтрация по стране', () => {
      it('должен успешно возвращать границы для страны', async () => {
        const mockSites = [
          { longitude: 10, latitude: 20 },
          { longitude: 15, latitude: 25 },
          { longitude: 12, latitude: 22 },
        ];

        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        mockSupabase.from.mockReturnValue(mockQuery as any);

        const request = createRequest('http://localhost:3000/api/bounds?type=country&id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual([10, 20, 15, 25]); // minLng, minLat, maxLng, maxLat
        expect(mockSupabase.from).toHaveBeenCalledWith('sites');
        expect(mockQuery.select).toHaveBeenCalledWith('longitude, latitude');
        expect(mockQuery.eq).toHaveBeenCalledWith('country_id', 1);
      });

      it('должен возвращать ошибку при ошибке базы данных', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
        };

        mockSupabase.from.mockReturnValue(mockQuery as any);

        const request = createRequest('http://localhost:3000/api/bounds?type=country&id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Database error');
      });

      it('должен возвращать 404 при отсутствии сайтов', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: [], error: null }),
        };

        mockSupabase.from.mockReturnValue(mockQuery as any);

        const request = createRequest('http://localhost:3000/api/bounds?type=country&id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('No sites found for the specified criteria');
      });
    });

    describe('фильтрация по региону', () => {
      it('должен успешно возвращать границы для региона', async () => {
        const mockCountries = [{ id: 1 }, { id: 2 }];
        const mockSites = [
          { longitude: 10, latitude: 20 },
          { longitude: 15, latitude: 25 },
        ];

        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: mockCountries, error: null }),
        };

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockCountriesQuery as any)
          .mockReturnValueOnce(mockSitesQuery as any);

        const request = createRequest('http://localhost:3000/api/bounds?type=region&id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual([10, 20, 15, 25]);
        expect(mockSupabase.from).toHaveBeenCalledWith('countries');
        expect(mockSupabase.from).toHaveBeenCalledWith('sites');
      });

      it('должен обрабатывать ошибку при получении стран', async () => {
        const mockCountriesQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'Countries error' } }),
        };

        mockSupabase.from.mockReturnValue(mockCountriesQuery as any);

        const request = createRequest('http://localhost:3000/api/bounds?type=region&id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to fetch bounds');
      });
    });

    describe('фильтрация по локации', () => {
      it('должен успешно возвращать границы для локации', async () => {
        const mockSiteLocations = [{ site_id: 1 }, { site_id: 2 }];
        const mockSites = [
          { longitude: 10, latitude: 20 },
          { longitude: 15, latitude: 25 },
        ];

        const mockSiteLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: mockSiteLocations, error: null }),
        };

        const mockSitesQuery = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ data: mockSites, error: null }),
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSiteLocationsQuery as any)
          .mockReturnValueOnce(mockSitesQuery as any);

        const request = createRequest('http://localhost:3000/api/bounds?type=location&id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual([10, 20, 15, 25]);
        expect(mockSupabase.from).toHaveBeenCalledWith('site_locations');
        expect(mockSupabase.from).toHaveBeenCalledWith('sites');
      });

      it('должен обрабатывать ошибку при получении локаций сайтов', async () => {
        const mockSiteLocationsQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest
            .fn()
            .mockResolvedValue({ data: null, error: { message: 'Site locations error' } }),
        };

        mockSupabase.from.mockReturnValue(mockSiteLocationsQuery as any);

        const request = createRequest('http://localhost:3000/api/bounds?type=location&id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to fetch bounds');
      });
    });

    describe('обработка исключений', () => {
      it('должен обрабатывать общие исключения', async () => {
        mockSupabase.from.mockImplementation(() => {
          throw new Error('Unexpected error');
        });

        const request = createRequest('http://localhost:3000/api/bounds?type=country&id=1');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to fetch bounds');
      });
    });
  });
});
