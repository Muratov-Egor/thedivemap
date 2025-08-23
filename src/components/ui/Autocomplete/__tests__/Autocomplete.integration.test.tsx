import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Autocomplete from '../Autocomplete';

// Мокаем fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Мокаем i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        placeholder: 'Поиск мест для дайвинга...',
        searchLabel: 'Поиск',
        clearButton: 'Очистить',
        'errors.searchFailed': 'Ошибка поиска',
        'types.site': 'Сайт',
        'types.country': 'Страна',
        'types.region': 'Регион',
        'types.location': 'Локация',
        loading: 'Загрузка...',
        resultsLabel: 'Результаты поиска',
        resultsCount: 'Найдено результатов',
      };
      return translations[key] || key;
    },
  }),
}));

// Мокаем utils
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
  getCountryFlag: (isoCode: string) => {
    const flags: Record<string, string> = {
      TC: '🇹🇨',
      TH: '🇹🇭',
    };
    return flags[isoCode] || '🌍';
  },
}));

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

describe('Autocomplete Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('полный цикл поиска и выбора элемента', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const onSelect = jest.fn();
    const onSearch = jest.fn();

    render(<Autocomplete onSelect={onSelect} onSearch={onSearch} />);

    const input = screen.getByTestId('autocomplete-input');

    // Вводим текст
    fireEvent.change(input, { target: { value: 'test' } });
    expect(onSearch).toHaveBeenCalledWith('test');

    // Ждем debounce и API ответ
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/places?q=test&lang=ru'),
        expect.any(Object),
      );
    });

    // Проверяем, что результаты отображаются
    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-list')).toBeInTheDocument();
    });

    // Выбираем элемент
    const firstItem = screen.getAllByTestId('autocomplete-item')[0];
    fireEvent.click(firstItem);

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'Test Site',
        type: 'site',
      }),
    );
  });

  it('обрабатывает ошибку API и восстановление', async () => {
    // Сначала возвращаем ошибку
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const onSelect = jest.fn();
    render(<Autocomplete onSelect={onSelect} />);

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Проверяем отображение ошибки
    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-error-message')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    // Очищаем и пробуем снова
    const clearButton = screen.getByTestId('autocomplete-clear-button');
    fireEvent.click(clearButton);

    // Теперь возвращаем успешный ответ
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    fireEvent.change(input, { target: { value: 'test2' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Проверяем, что ошибка исчезла и результаты отображаются
    await waitFor(() => {
      expect(screen.queryByTestId('autocomplete-error-message')).not.toBeInTheDocument();
      expect(screen.getByTestId('autocomplete-list')).toBeInTheDocument();
    });
  });

  it('клавиатурная навигация работает правильно', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    render(<Autocomplete />);

    const input = screen.getByTestId('autocomplete-input');

    // Вводим текст и ждем результаты
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-list')).toBeInTheDocument();
    });

    // Проверяем, что элементы отображаются
    const items = screen.getAllByTestId('autocomplete-item');
    expect(items).toHaveLength(4);

    // Проверяем, что первый элемент изначально выбран
    expect(items[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('выбор элемента с клавиатуры', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const onSelect = jest.fn();
    render(<Autocomplete onSelect={onSelect} />);

    const input = screen.getByTestId('autocomplete-input');

    // Вводим текст и ждем результаты
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-list')).toBeInTheDocument();
    });

    // Выбираем первый элемент
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        type: expect.any(String),
      }),
    );
  });

  it('закрытие dropdown с Escape', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    render(<Autocomplete />);

    const input = screen.getByTestId('autocomplete-input');

    // Вводим текст и ждем результаты
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-list')).toBeInTheDocument();
    });

    // Закрываем с Escape
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryByTestId('autocomplete-list')).not.toBeInTheDocument();
  });

  it('клик вне компонента закрывает dropdown', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    render(<Autocomplete />);

    const input = screen.getByTestId('autocomplete-input');

    // Вводим текст и ждем результаты
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-list')).toBeInTheDocument();
    });

    // Кликаем вне компонента
    fireEvent.mouseDown(document.body);

    expect(screen.queryByTestId('autocomplete-list')).not.toBeInTheDocument();
  });

  it('отображает разные типы результатов с правильными иконками', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    render(<Autocomplete />);

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-list')).toBeInTheDocument();
    });

    // Проверяем, что все типы отображаются
    expect(screen.getByText('Test Site')).toBeInTheDocument(); // site
    expect(screen.getByText('Test Country')).toBeInTheDocument(); // country
    expect(screen.getByText('Test Region')).toBeInTheDocument(); // region
    expect(screen.getByText('Test Location')).toBeInTheDocument(); // location
  });

  it('правильно обрабатывает состояние загрузки', async () => {
    // Мокаем медленный ответ
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => mockApiResponse,
              } as Response),
            1000,
          ),
        ),
    );

    render(<Autocomplete />);

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Проверяем состояние загрузки
    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-loading')).toBeInTheDocument();
    });

    // Ждем завершения запроса
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('autocomplete-loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('autocomplete-list')).toBeInTheDocument();
    });
  });

  it('отменяет предыдущий запрос при новом поиске', async () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

    // Мокаем fetch чтобы он не завершался сразу
    mockFetch.mockImplementation(
      () => new Promise(() => {}), // Никогда не завершается
    );

    render(<Autocomplete />);

    const input = screen.getByTestId('autocomplete-input');

    // Первый поиск
    fireEvent.change(input, { target: { value: 'test1' } });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Второй поиск до завершения первого
    fireEvent.change(input, { target: { value: 'test2' } });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Проверяем, что abort был вызван
    expect(abortSpy).toHaveBeenCalled();
  });

  it('правильно обрабатывает пустой ответ API', async () => {
    const emptyResponse = {
      sites: [],
      countries: [],
      regions: [],
      locations: [],
      errors: { countries: null, regions: null, locations: null },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => emptyResponse,
    } as Response);

    render(<Autocomplete />);

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Проверяем, что список не отображается
    await waitFor(() => {
      expect(screen.queryByTestId('autocomplete-list')).not.toBeInTheDocument();
    });
  });

  it('поддерживает разные языки', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    render(<Autocomplete language="en" />);

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'test' } });

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

  it('правильно обрабатывает disabled состояние', () => {
    render(<Autocomplete disabled={true} />);

    const input = screen.getByTestId('autocomplete-input');
    expect(input).toBeDisabled();

    // Попытка ввода не должна работать
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('правильно обрабатывает loading состояние из пропсов', () => {
    render(<Autocomplete loading={true} />);

    expect(screen.getByTestId('autocomplete-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('autocomplete-clear-button')).not.toBeInTheDocument();
  });
});
