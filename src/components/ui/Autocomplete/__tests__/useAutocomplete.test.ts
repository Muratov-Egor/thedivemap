import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutocomplete } from '../useAutocomplete';
import { AutocompleteItem } from '../types';

// Мокаем fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Тестовые данные
const mockApiResponse = {
  sites: [
    {
      id: 1,
      name: 'Test Site',
      country: { name: 'Test Country', region: { name: 'Test Region' } },
      site_type: { label: 'Reef' },
      site_locations: [{ location: { name: 'Test Location' } }],
    },
  ],
  countries: [{ id: 2, name: 'Test Country', iso_code: 'TC' }],
  regions: [{ id: 3, name: 'Test Region' }],
  locations: [{ id: 4, name: 'Test Location', country_id: 2, region_id: 3 }],
  errors: { countries: null, regions: null, locations: null },
};

const mockTransformedItems: AutocompleteItem[] = [
  {
    id: 1,
    name: 'Test Site',
    type: 'site',
    subtitle: 'Test Country Test Region',
    metadata: {
      site_type: 'Reef',
      locations: ['Test Location'],
    },
  },
  {
    id: 2,
    name: 'Test Country',
    type: 'country',
    subtitle: 'TC',
    metadata: { iso_code: 'TC' },
  },
  {
    id: 3,
    name: 'Test Region',
    type: 'region',
    metadata: {},
  },
  {
    id: 4,
    name: 'Test Location',
    type: 'location',
    metadata: {
      country_id: 2,
      region_id: 3,
    },
  },
];

describe('useAutocomplete Hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('инициализируется с правильным начальным состоянием', () => {
    const { result } = renderHook(() => useAutocomplete());

    expect(result.current.state).toEqual({
      query: '',
      results: [],
      selectedIndex: -1,
      isOpen: false,
      isLoading: false,
      error: null,
    });
  });

  it('устанавливает query через setQuery', () => {
    const { result } = renderHook(() => useAutocomplete());

    act(() => {
      result.current.actions.setQuery('test query');
    });

    expect(result.current.state.query).toBe('test query');
    expect(result.current.state.selectedIndex).toBe(-1);
  });

  it('не запускает поиск при коротком query', async () => {
    const { result } = renderHook(() => useAutocomplete());

    act(() => {
      result.current.actions.setQuery('a');
    });

    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled();
    });

    expect(result.current.state.results).toEqual([]);
    expect(result.current.state.isOpen).toBe(false);
  });

  it('запускает поиск при достаточной длине query', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const { result } = renderHook(() => useAutocomplete());

    act(() => {
      result.current.actions.setQuery('test');
    });

    // Ждем debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/places?q=test&lang=ru'),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });
  });

  it('правильно трансформирует API ответ в AutocompleteItem', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const { result } = renderHook(() => useAutocomplete());

    act(() => {
      result.current.actions.setQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.state.results).toEqual(mockTransformedItems);
      expect(result.current.state.isOpen).toBe(true);
      expect(result.current.state.selectedIndex).toBe(0);
    });
  });

  it('обрабатывает ошибки API', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAutocomplete());

    act(() => {
      result.current.actions.setQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.state.error).toBe('Network error');
      expect(result.current.state.isOpen).toBe(false);
      expect(result.current.state.isLoading).toBe(false);
    });
  });

  it('обрабатывает HTTP ошибки', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useAutocomplete());

    act(() => {
      result.current.actions.setQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.state.error).toBe('HTTP error! status: 500');
      expect(result.current.state.isOpen).toBe(false);
    });
  });

  it('отменяет предыдущий запрос при новом поиске', async () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

    // Мокаем fetch чтобы он не завершался сразу
    mockFetch.mockImplementation(
      () => new Promise(() => {}), // Никогда не завершается
    );

    const { result } = renderHook(() => useAutocomplete());

    act(() => {
      result.current.actions.setQuery('test1');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    act(() => {
      result.current.actions.setQuery('test2');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Проверяем, что abort был вызван
    expect(abortSpy).toHaveBeenCalled();
  });

  it('выбирает элемент и очищает результаты', () => {
    const onSelect = jest.fn();
    const { result } = renderHook(() => useAutocomplete(onSelect));

    // Устанавливаем начальное состояние с результатами
    act(() => {
      result.current.actions.setQuery('test');
    });

    const testItem: AutocompleteItem = {
      id: 1,
      name: 'Test Item',
      type: 'site',
    };

    act(() => {
      result.current.actions.selectItem(testItem);
    });

    expect(result.current.state.query).toBe('Test Item');
    expect(result.current.state.results).toEqual([]);
    expect(result.current.state.isOpen).toBe(false);
    expect(result.current.state.selectedIndex).toBe(-1);
    expect(onSelect).toHaveBeenCalledWith(testItem);
  });

  it('навигация по стрелкам работает правильно', () => {
    const { result } = renderHook(() => useAutocomplete());

    // Устанавливаем результаты
    act(() => {
      result.current.actions.setQuery('test');
    });

    // Симулируем результаты
    act(() => {
      result.current.state.results = mockTransformedItems;
      result.current.state.selectedIndex = 0;
    });

    act(() => {
      result.current.actions.navigateDown();
    });

    expect(result.current.state.selectedIndex).toBe(1);

    act(() => {
      result.current.actions.navigateUp();
    });

    expect(result.current.state.selectedIndex).toBe(0);

    // Проверяем циклическую навигацию
    act(() => {
      result.current.actions.navigateUp();
    });

    expect(result.current.state.selectedIndex).toBe(3); // Последний элемент
  });

  it('открывает и закрывает dropdown', () => {
    const { result } = renderHook(() => useAutocomplete());

    act(() => {
      result.current.actions.openDropdown();
    });

    expect(result.current.state.isOpen).toBe(false); // Нет результатов

    // Устанавливаем результаты
    act(() => {
      result.current.state.results = mockTransformedItems;
    });

    act(() => {
      result.current.actions.openDropdown();
    });

    expect(result.current.state.isOpen).toBe(true);

    act(() => {
      result.current.actions.closeDropdown();
    });

    expect(result.current.state.isOpen).toBe(false);
    expect(result.current.state.selectedIndex).toBe(-1);
  });

  it('очищает результаты', () => {
    const { result } = renderHook(() => useAutocomplete());

    // Устанавливаем результаты
    act(() => {
      result.current.state.results = mockTransformedItems;
      result.current.state.isOpen = true;
      result.current.state.selectedIndex = 1;
    });

    act(() => {
      result.current.actions.clearResults();
    });

    expect(result.current.state.results).toEqual([]);
    expect(result.current.state.isOpen).toBe(false);
    expect(result.current.state.selectedIndex).toBe(-1);
    expect(result.current.state.error).toBe(null);
  });

  it('использует правильный язык в API запросе', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const { result } = renderHook(() => useAutocomplete(undefined, 300, 2, 10, 'en'));

    act(() => {
      result.current.actions.setQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/places?q=test&lang=en'),
        expect.any(Object),
      );
    });
  });

  it('ограничивает количество результатов', async () => {
    const largeResponse = {
      ...mockApiResponse,
      sites: Array.from({ length: 20 }, (_, i) => ({
        ...mockApiResponse.sites[0],
        id: i + 1,
        name: `Site ${i + 1}`,
      })),
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => largeResponse,
    } as Response);

    const { result } = renderHook(() => useAutocomplete(undefined, 300, 2, 5));

    act(() => {
      result.current.actions.setQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.state.results).toHaveLength(5);
    });
  });
});
