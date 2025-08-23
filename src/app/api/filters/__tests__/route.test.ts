/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest } from 'next/server';
import { GET } from '../route';
import { supabase } from '@/lib/supabase';

// Мокаем NextResponse
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    constructor(url: string) {
      this.url = url;
    }
    url: string;
  },
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => Promise.resolve(data),
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

describe('/api/filters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all filters with labels on all languages', async () => {
      const mockSiteTypes = [
        { id: 1, label_ru: 'Риф', label_en: 'Reef' },
        { id: 2, label_ru: 'Затонувшее судно', label_en: 'Wreck' },
      ];

      const mockDifficulties = [
        { id: 1, label_ru: 'Легкий', label_en: 'Easy' },
        { id: 2, label_ru: 'Средний', label_en: 'Medium' },
      ];

      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockSiteTypes,
            error: null,
          }),
        }),
      } as any);

      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockDifficulties,
            error: null,
          }),
        }),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/filters');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        site_types: [
          {
            id: 1,
            labels: { ru: 'Риф', en: 'Reef' },
          },
          {
            id: 2,
            labels: { ru: 'Затонувшее судно', en: 'Wreck' },
          },
        ],
        difficulties: [
          {
            id: 1,
            labels: { ru: 'Легкий', en: 'Easy' },
          },
          {
            id: 2,
            labels: { ru: 'Средний', en: 'Medium' },
          },
        ],
      });

      expect(mockSupabase.from).toHaveBeenCalledWith('site_types');
      expect(mockSupabase.from).toHaveBeenCalledWith('difficulties');
    });

    it('should handle site types database error', async () => {
      // Мокаем оба запроса, которые выполняются параллельно в Promise.all
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Site types database error' },
          }),
        }),
      } as any);

      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/filters');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Site types database error' });
    });

    it('should handle difficulties database error', async () => {
      const mockSiteTypes = [{ id: 1, label_ru: 'Риф', label_en: 'Reef' }];

      // Мокаем оба запроса, которые выполняются параллельно в Promise.all
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockSiteTypes,
            error: null,
          }),
        }),
      } as any);

      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Difficulties database error' },
          }),
        }),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/filters');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Difficulties database error' });
    });

    it('should handle unexpected errors', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const request = new NextRequest('http://localhost:3000/api/filters');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch filters' });
    });
  });
});
