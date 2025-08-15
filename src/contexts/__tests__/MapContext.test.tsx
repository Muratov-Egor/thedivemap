import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MapProvider, useMap } from '../MapContext';
import type { Map } from 'maplibre-gl';
import type { Site } from '@/types/database';
import type { Cluster } from '@/types/clustering';

// Мокаем react-i18next
const mockT = jest.fn((key, options) => {
  if (key === 'autocomplete:noDiveSites.title' && options?.location) {
    return `В ${options.location} пока нет известных нам дайв-сайтов`;
  }
  return key;
});
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
    i18n: { language: 'ru' },
    ready: true,
  })),
}));

// Мокаем fetch
global.fetch = jest.fn();

// Мокаем maplibre-gl
const mockFlyTo = jest.fn();
const mockFitBounds = jest.fn();
const mockGetContainer = jest.fn(() => ({ offsetWidth: 1024 }));

jest.mock('maplibre-gl', () => ({
  Map: jest.fn().mockImplementation(() => ({
    flyTo: mockFlyTo,
    fitBounds: mockFitBounds,
    getContainer: mockGetContainer,
  })),
}));

// Мокаем console.error и console.warn для проверки вызовов
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Функция-помощник для создания тестового Site
const createTestSite = (id: string, name: string): Site => ({
  id,
  name,
  description: 'Test description',
  latitude: 10,
  longitude: 20,
  country_id: 1,
  depth_max: 10,
  visibility: 5,
  info_links: null,
  dive_center_links: null,
  rating: 5,
  site_type_id: 1,
  difficulty_id: 1,
  status: 'published',
  created_at: '2024-01-01',
});

// Тестовый компонент для использования контекста
function TestComponent() {
  const context = useMap();
  return (
    <div>
      <div data-testid="map">{context.map ? 'Map loaded' : 'No map'}</div>
      <div data-testid="is-loaded">{context.isLoaded ? 'Loaded' : 'Not loaded'}</div>
      <div data-testid="dive-sites-count">{context.diveSites.length}</div>
      <div data-testid="selected-site">{context.selectedSite?.name || 'No site selected'}</div>
      <div data-testid="loading">{context.loading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="error">{context.error || 'No error'}</div>
      <div data-testid="autocomplete-info-message">
        {context.autocompleteInfoMessage || 'No message'}
      </div>
    </div>
  );
}

describe('MapContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('MapProvider', () => {
    it('предоставляет начальные значения контекста', () => {
      render(
        <MapProvider>
          <TestComponent />
        </MapProvider>,
      );

      expect(screen.getByTestId('map')).toHaveTextContent('No map');
      expect(screen.getByTestId('is-loaded')).toHaveTextContent('Not loaded');
      expect(screen.getByTestId('dive-sites-count')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-site')).toHaveTextContent('No site selected');
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
      expect(screen.getByTestId('error')).toHaveTextContent('No error');
      expect(screen.getByTestId('autocomplete-info-message')).toHaveTextContent('No message');
    });

    it('позволяет установить карту', () => {
      const TestMapComponent = () => {
        const context = useMap();
        const [mapState, setMapState] = React.useState('No map');

        React.useEffect(() => {
          if (context.map) {
            setMapState('Map loaded');
          }
        }, [context.map]);

        return (
          <div>
            <div data-testid="map">{mapState}</div>
            <button
              data-testid="set-map"
              onClick={() => {
                context.setMap({} as Map);
              }}
            >
              Set Map
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestMapComponent />
        </MapProvider>,
      );

      act(() => {
        screen.getByTestId('set-map').click();
      });

      waitFor(() => {
        expect(screen.getByTestId('map')).toHaveTextContent('Map loaded');
      });
    });

    it('позволяет установить состояние загрузки', () => {
      const TestLoadedComponent = () => {
        const context = useMap();
        const [loadedState, setLoadedState] = React.useState('Not loaded');

        React.useEffect(() => {
          if (context.isLoaded) {
            setLoadedState('Loaded');
          }
        }, [context.isLoaded]);

        return (
          <div>
            <div data-testid="is-loaded">{loadedState}</div>
            <button
              data-testid="set-loaded"
              onClick={() => {
                context.setLoaded(true);
              }}
            >
              Set Loaded
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestLoadedComponent />
        </MapProvider>,
      );

      act(() => {
        screen.getByTestId('set-loaded').click();
      });

      waitFor(() => {
        expect(screen.getByTestId('is-loaded')).toHaveTextContent('Loaded');
      });
    });

    it('позволяет выбрать сайт', () => {
      const TestSelectComponent = () => {
        const context = useMap();
        const [siteState, setSiteState] = React.useState('No site selected');

        React.useEffect(() => {
          if (context.selectedSite) {
            setSiteState(context.selectedSite.name);
          }
        }, [context.selectedSite]);

        return (
          <div>
            <div data-testid="selected-site">{siteState}</div>
            <button
              data-testid="select-site"
              onClick={() => {
                context.selectSite(createTestSite('1', 'Test Site'));
              }}
            >
              Select Site
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestSelectComponent />
        </MapProvider>,
      );

      act(() => {
        screen.getByTestId('select-site').click();
      });

      waitFor(() => {
        expect(screen.getByTestId('selected-site')).toHaveTextContent('Test Site');
      });
    });

    it('обрабатывает клик по сайту', () => {
      const TestClickComponent = () => {
        const context = useMap();
        const [siteState, setSiteState] = React.useState('No site selected');

        React.useEffect(() => {
          if (context.selectedSite) {
            setSiteState(context.selectedSite.name);
          }
        }, [context.selectedSite]);

        return (
          <div>
            <div data-testid="selected-site">{siteState}</div>
            <button
              data-testid="on-site-click"
              onClick={() => {
                context.onSiteClick(createTestSite('1', 'Clicked Site'));
              }}
            >
              Site Click
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestClickComponent />
        </MapProvider>,
      );

      act(() => {
        screen.getByTestId('on-site-click').click();
      });

      waitFor(() => {
        expect(screen.getByTestId('selected-site')).toHaveTextContent('Clicked Site');
      });
    });

    it('обрабатывает клик по кластеру', () => {
      const TestClusterComponent = () => {
        const context = useMap();
        return (
          <div>
            <div data-testid="selected-site">
              {context.selectedSite?.name || 'No site selected'}
            </div>
            <button
              data-testid="on-cluster-click"
              onClick={() => context.onClusterClick({} as Cluster)}
            >
              Cluster Click
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestClusterComponent />
        </MapProvider>,
      );

      screen.getByTestId('on-cluster-click').click();
      // Клик по кластеру не должен изменять выбранный сайт
      expect(screen.getByTestId('selected-site')).toHaveTextContent('No site selected');
    });
  });

  describe('useMap hook', () => {
    it('выбрасывает ошибку при использовании вне провайдера', () => {
      const TestComponentWithoutProvider = () => {
        useMap();
        return <div>Test</div>;
      };

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useMap must be used within MapProvider');
    });
  });

  describe('fetchDiveSites', () => {
    it('успешно загружает дайв-сайты', async () => {
      const mockSites = [
        { id: 1, name: 'Site 1', latitude: 10, longitude: 20 },
        { id: 2, name: 'Site 2', latitude: 15, longitude: 25 },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSites,
      });

      const TestFetchComponent = () => {
        const context = useMap();
        const [sitesCount, setSitesCount] = React.useState(0);
        const [loadingState, setLoadingState] = React.useState('Not loading');

        React.useEffect(() => {
          setSitesCount(context.diveSites.length);
          setLoadingState(context.loading ? 'Loading' : 'Not loading');
        }, [context.diveSites.length, context.loading]);

        return (
          <div>
            <div data-testid="sites-count">{sitesCount}</div>
            <div data-testid="loading-state">{loadingState}</div>
            <button data-testid="fetch-sites" onClick={() => context.fetchDiveSites()}>
              Fetch Sites
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestFetchComponent />
        </MapProvider>,
      );

      act(() => {
        screen.getByTestId('fetch-sites').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('sites-count')).toHaveTextContent('2');
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/dive-sites');
    });

    it('обрабатывает ошибку при загрузке дайв-сайтов', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const TestErrorComponent = () => {
        const context = useMap();
        const [errorState, setErrorState] = React.useState('No error');

        React.useEffect(() => {
          setErrorState(context.error || 'No error');
        }, [context.error]);

        return (
          <div>
            <div data-testid="error-state">{errorState}</div>
            <button data-testid="fetch-sites" onClick={() => context.fetchDiveSites()}>
              Fetch Sites
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestErrorComponent />
        </MapProvider>,
      );

      act(() => {
        screen.getByTestId('fetch-sites').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toHaveTextContent('Network error');
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
      });
    });

    it('обрабатывает ошибку сервера', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const TestServerErrorComponent = () => {
        const context = useMap();
        const [errorState, setErrorState] = React.useState('No error');

        React.useEffect(() => {
          setErrorState(context.error || 'No error');
        }, [context.error]);

        return (
          <div>
            <div data-testid="error-state">{errorState}</div>
            <button data-testid="fetch-sites" onClick={() => context.fetchDiveSites()}>
              Fetch Sites
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestServerErrorComponent />
        </MapProvider>,
      );

      act(() => {
        screen.getByTestId('fetch-sites').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toHaveTextContent('map.error.fetchFailed');
      });
    });

    it('предотвращает повторные запросы', async () => {
      const mockSites = [{ id: 1, name: 'Site 1' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSites,
      });

      const TestPreventComponent = () => {
        const context = useMap();
        return (
          <div>
            <button data-testid="fetch-sites" onClick={() => context.fetchDiveSites()}>
              Fetch Sites
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestPreventComponent />
        </MapProvider>,
      );

      // Первый вызов
      act(() => {
        screen.getByTestId('fetch-sites').click();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Второй вызов - не должен вызывать fetch
      act(() => {
        screen.getByTestId('fetch-sites').click();
      });

      // Проверяем, что fetch был вызван только один раз
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('centerOnSelection', () => {
    it('вызывает fetch для загрузки сайта при центрировании', async () => {
      const mockSite = { id: 1, name: 'Test Site', latitude: 10, longitude: 20 };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockSite],
      });

      const TestCenterComponent = () => {
        const context = useMap();
        const [mapState, setMapState] = React.useState('No map');

        React.useEffect(() => {
          if (context.map) {
            setMapState('Map loaded');
          }
        }, [context.map]);

        return (
          <div>
            <div data-testid="map-state">{mapState}</div>
            <button data-testid="set-map" onClick={() => context.setMap({} as Map)}>
              Set Map
            </button>
            <button
              data-testid="center-site"
              onClick={() => context.centerOnSelection({ type: 'site', id: 1, name: 'Test Site' })}
            >
              Center on Site
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestCenterComponent />
        </MapProvider>,
      );

      // Сначала устанавливаем карту
      act(() => {
        screen.getByTestId('set-map').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('map-state')).toHaveTextContent('Map loaded');
      });

      // Затем центрируем на сайте
      act(() => {
        screen.getByTestId('center-site').click();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/dive-sites?id=1');
      });
    });

    it('вызывает fetch для загрузки bounds при центрировании на регионе', async () => {
      const mockBounds = [10, 20, 30, 40]; // [minLng, minLat, maxLng, maxLat]

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBounds,
      });

      const TestRegionComponent = () => {
        const context = useMap();
        const [mapState, setMapState] = React.useState('No map');

        React.useEffect(() => {
          if (context.map) {
            setMapState('Map loaded');
          }
        }, [context.map]);

        return (
          <div>
            <div data-testid="map-state">{mapState}</div>
            <button data-testid="set-map" onClick={() => context.setMap({} as Map)}>
              Set Map
            </button>
            <button
              data-testid="center-region"
              onClick={() =>
                context.centerOnSelection({ type: 'region', id: 1, name: 'Test Region' })
              }
            >
              Center on Region
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestRegionComponent />
        </MapProvider>,
      );

      // Сначала устанавливаем карту
      act(() => {
        screen.getByTestId('set-map').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('map-state')).toHaveTextContent('Map loaded');
      });

      // Затем центрируем на регионе
      act(() => {
        screen.getByTestId('center-region').click();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/bounds?type=region&id=1');
      });
    });

    it('обрабатывает ошибку при загрузке bounds', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: 'No sites found' }),
      });

      const TestBoundsErrorComponent = () => {
        const context = useMap();
        const [mapState, setMapState] = React.useState('No map');

        React.useEffect(() => {
          if (context.map) {
            setMapState('Map loaded');
          }
        }, [context.map]);

        return (
          <div>
            <div data-testid="map-state">{mapState}</div>
            <button data-testid="set-map" onClick={() => context.setMap({} as Map)}>
              Set Map
            </button>
            <button
              data-testid="center-region"
              onClick={() =>
                context.centerOnSelection({ type: 'region', id: 1, name: 'Test Region' })
              }
            >
              Center on Region
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestBoundsErrorComponent />
        </MapProvider>,
      );

      // Сначала устанавливаем карту
      act(() => {
        screen.getByTestId('set-map').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('map-state')).toHaveTextContent('Map loaded');
      });

      // Затем пытаемся центрировать на регионе
      act(() => {
        screen.getByTestId('center-region').click();
      });

      await waitFor(() => {
        expect(console.warn).toHaveBeenCalledWith(
          'No dive sites found for region: Test Region - No sites found',
        );
      });
    });

    it('обрабатывает невалидные bounds', async () => {
      const invalidBounds = [30, 40, 10, 20]; // max < min - невалидные

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidBounds,
      });

      const TestInvalidBoundsComponent = () => {
        const context = useMap();
        const [mapState, setMapState] = React.useState('No map');

        React.useEffect(() => {
          if (context.map) {
            setMapState('Map loaded');
          }
        }, [context.map]);

        return (
          <div>
            <div data-testid="map-state">{mapState}</div>
            <button data-testid="set-map" onClick={() => context.setMap({} as Map)}>
              Set Map
            </button>
            <button
              data-testid="center-region"
              onClick={() =>
                context.centerOnSelection({ type: 'region', id: 1, name: 'Test Region' })
              }
            >
              Center on Region
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestInvalidBoundsComponent />
        </MapProvider>,
      );

      // Сначала устанавливаем карту
      act(() => {
        screen.getByTestId('set-map').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('map-state')).toHaveTextContent('Map loaded');
      });

      // Затем пытаемся центрировать на регионе
      act(() => {
        screen.getByTestId('center-region').click();
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Invalid bounds: min values must be less than max values',
        );
      });
    });

    it('обрабатывает 404 ошибку при загрузке bounds', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const Test404Component = () => {
        const context = useMap();
        const [mapState, setMapState] = React.useState('No map');

        React.useEffect(() => {
          if (context.map) {
            setMapState('Map loaded');
          }
        }, [context.map]);

        return (
          <div>
            <div data-testid="map-state">{mapState}</div>
            <button data-testid="set-map" onClick={() => context.setMap({} as Map)}>
              Set Map
            </button>
            <button
              data-testid="center-region"
              onClick={() =>
                context.centerOnSelection({ type: 'region', id: 1, name: 'Test Region' })
              }
            >
              Center on Region
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <Test404Component />
        </MapProvider>,
      );

      // Сначала устанавливаем карту
      act(() => {
        screen.getByTestId('set-map').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('map-state')).toHaveTextContent('Map loaded');
      });

      // Затем пытаемся центрировать на регионе
      act(() => {
        screen.getByTestId('center-region').click();
      });

      await waitFor(() => {
        expect(console.warn).toHaveBeenCalledWith('No dive sites found for region: Test Region');
      });
    });

    it('показывает информационное сообщение при 404 ошибке', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const TestInfoMessageComponent = () => {
        const context = useMap();
        const [messageState, setMessageState] = React.useState('No message');

        React.useEffect(() => {
          if (context.autocompleteInfoMessage) {
            setMessageState(context.autocompleteInfoMessage);
          }
        }, [context.autocompleteInfoMessage]);

        return (
          <div>
            <div data-testid="info-message">{messageState}</div>
            <div data-testid="map-state">{context.map ? 'Map loaded' : 'No map'}</div>
            <button data-testid="set-map" onClick={() => context.setMap({} as Map)}>
              Set Map
            </button>
            <button
              data-testid="center-region"
              onClick={() =>
                context.centerOnSelection({ type: 'region', id: 1, name: 'Test Region' })
              }
            >
              Center on Region
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestInfoMessageComponent />
        </MapProvider>,
      );

      // Сначала устанавливаем карту
      act(() => {
        screen.getByTestId('set-map').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('map-state')).toHaveTextContent('Map loaded');
      });

      // Затем пытаемся центрировать на регионе
      act(() => {
        screen.getByTestId('center-region').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('info-message')).toHaveTextContent(
          'В Test Region пока нет известных нам дайв-сайтов',
        );
      });
    });

    it('очищает информационное сообщение через clearAutocompleteInfoMessage', () => {
      const TestClearMessageComponent = () => {
        const context = useMap();
        const [messageState, setMessageState] = React.useState('No message');

        React.useEffect(() => {
          if (context.autocompleteInfoMessage) {
            setMessageState(context.autocompleteInfoMessage);
          }
        }, [context.autocompleteInfoMessage]);

        return (
          <div>
            <div data-testid="info-message">{messageState}</div>
            <button
              data-testid="clear-message"
              onClick={() => context.clearAutocompleteInfoMessage()}
            >
              Clear Message
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestClearMessageComponent />
        </MapProvider>,
      );

      // Проверяем, что сообщение изначально пустое
      expect(screen.getByTestId('info-message')).toHaveTextContent('No message');

      // Очищаем сообщение (должно остаться пустым)
      act(() => {
        screen.getByTestId('clear-message').click();
      });

      expect(screen.getByTestId('info-message')).toHaveTextContent('No message');
    });

    it('обрабатывает ошибку когда карта не инициализирована', async () => {
      const TestNoMapComponent = () => {
        const context = useMap();
        return (
          <div>
            <button
              data-testid="center-site"
              onClick={() => context.centerOnSelection({ type: 'site', id: 1, name: 'Test Site' })}
            >
              Center on Site
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestNoMapComponent />
        </MapProvider>,
      );

      act(() => {
        screen.getByTestId('center-site').click();
      });

      expect(console.error).toHaveBeenCalledWith('Map is not initialized');
    });

    it('вызывает fetch для загрузки bounds при центрировании на регионе (мобильный)', async () => {
      const mockBounds = [10, 20, 30, 40];

      // Мокаем мобильный экран
      mockGetContainer.mockReturnValueOnce({ offsetWidth: 500 });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBounds,
      });

      const TestMobileComponent = () => {
        const context = useMap();
        const [mapState, setMapState] = React.useState('No map');

        React.useEffect(() => {
          if (context.map) {
            setMapState('Map loaded');
          }
        }, [context.map]);

        return (
          <div>
            <div data-testid="map-state">{mapState}</div>
            <button data-testid="set-map" onClick={() => context.setMap({} as Map)}>
              Set Map
            </button>
            <button
              data-testid="center-region"
              onClick={() =>
                context.centerOnSelection({ type: 'region', id: 1, name: 'Test Region' })
              }
            >
              Center on Region
            </button>
          </div>
        );
      };

      render(
        <MapProvider>
          <TestMobileComponent />
        </MapProvider>,
      );

      // Сначала устанавливаем карту
      act(() => {
        screen.getByTestId('set-map').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('map-state')).toHaveTextContent('Map loaded');
      });

      // Затем центрируем на регионе
      act(() => {
        screen.getByTestId('center-region').click();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/bounds?type=region&id=1');
      });
    });
  });
});
