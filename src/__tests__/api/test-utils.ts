import type { Site } from '@/types/database';

// Утилиты для тестов
export class APITestHelper {
  static createMockSite(overrides: Partial<Site> = {}): Site {
    return {
      id: 'test-id',
      name: 'Test Site',
      description: 'Test description',
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
      ...overrides,
    };
  }

  static createMockSupabaseResponse<T>(data: T, error: { message: string } | null = null) {
    return {
      data,
      error,
    };
  }

  static expectSuccessfulResponse(response: { status: number; json: () => Promise<unknown> }) {
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.json).toBeDefined();
  }

  static expectErrorResponse(
    response: { status: number; json: () => Promise<unknown> },
    status: number,
  ) {
    expect(response).toBeDefined();
    expect(response.status).toBe(status);
    expect(response.json).toBeDefined();
  }
}
