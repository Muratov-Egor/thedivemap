/* eslint-disable @typescript-eslint/no-explicit-any */

import { renderHook, waitFor } from '@testing-library/react';
import { useFilters } from '../useFilters';
import { FiltersProvider } from '@/contexts/FiltersContext';

// Мокаем react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'ru',
      changeLanguage: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

// Мокаем fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const renderHookWithProviders = () => {
  return renderHook(() => useFilters(), {
    wrapper: FiltersProvider,
  });
};

describe('useFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch filters successfully', async () => {
    const mockFilters = {
      site_types: [
        { 
          id: 1, 
          labels: { ru: 'Риф', en: 'Reef' }
        },
        { 
          id: 2, 
          labels: { ru: 'Затонувшее судно', en: 'Wreck' }
        },
      ],
      difficulties: [
        { 
          id: 1, 
          labels: { ru: 'Легкий', en: 'Easy' }
        },
        { 
          id: 2, 
          labels: { ru: 'Средний', en: 'Medium' }
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFilters,
    } as Response);

    const { result } = renderHookWithProviders();

    // Изначально загрузка
    expect(result.current.loading).toBe(true);
    expect(result.current.filters).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Проверяем, что возвращаются локализованные фильтры
    expect(result.current.filters).toEqual({
      site_types: [
        { id: 1, label: 'Риф' },
        { id: 2, label: 'Затонувшее судно' },
      ],
      difficulties: [
        { id: 1, label: 'Легкий' },
        { id: 2, label: 'Средний' },
      ],
    });
    expect(result.current.error).toBe(null);
    expect(mockFetch).toHaveBeenCalledWith('/api/filters');
  });

  it('should handle fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHookWithProviders();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.filters).toBe(null);
    expect(result.current.error).toBe('Network error');
  });

  it('should handle fetch returning undefined', async () => {
    mockFetch.mockResolvedValueOnce(undefined as any);

    const { result } = renderHookWithProviders();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.filters).toBe(null);
    expect(result.current.error).toBe("Cannot read properties of undefined (reading 'ok')");
  });

  it('should handle non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHookWithProviders();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.filters).toBe(null);
    expect(result.current.error).toBe('Failed to fetch filters');
  });

  it('should fetch filters only once', async () => {
    const mockFilters = {
      site_types: [{ 
        id: 1, 
        labels: { ru: 'Риф', en: 'Reef' }
      }],
      difficulties: [{ 
        id: 1, 
        labels: { ru: 'Легкий', en: 'Easy' }
      }],
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockFilters,
    } as Response);

    const { result } = renderHookWithProviders();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/api/filters');
  });
});
