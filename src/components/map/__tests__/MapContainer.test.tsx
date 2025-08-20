/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapContainer from '../MapContainer';
import { PanelProvider } from '@/contexts/PanelContext';

// Мокаем react-i18next
const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

// Мокаем MapContext
const mockSetMap = jest.fn();
const mockSetLoaded = jest.fn();
const mockFetchDiveSites = jest.fn();
const mockOnSiteClick = jest.fn();
const mockOnClusterClick = jest.fn();
const mockSetFetchDiveSiteDetailsCallback = jest.fn();
const mockUseMap = jest.fn();

jest.mock('@/contexts/MapContext', () => ({
  useMap: () => mockUseMap(),
}));

// Мокаем PanelContext
const mockShowInfo = jest.fn();
const mockClearDiveSite = jest.fn();
const mockSetClearDiveSiteHook = jest.fn();
const mockUsePanel = jest.fn();

// Мокаем ThemeContext
const mockUseTheme = jest.fn();

// Мокаем Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    has: jest.fn(),
  }),
}));

jest.mock('@/contexts/PanelContext', () => ({
  usePanel: () => mockUsePanel(),
  PanelProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

// Мокаем useDiveSiteDetails
const mockFetchDiveSiteDetails = jest.fn();
const mockClearDiveSiteHook = jest.fn();
const mockUseDiveSiteDetails = jest.fn();

jest.mock('@/hooks/useDiveSiteDetails', () => ({
  useDiveSiteDetails: () => mockUseDiveSiteDetails(),
}));

// Мокаем maplibre-gl
const mockMap = {
  on: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  addControl: jest.fn(),
  setStyle: jest.fn(),
};

jest.mock('maplibre-gl', () => ({
  Map: jest.fn(() => mockMap),
  NavigationControl: jest.fn(() => ({})),
  ScaleControl: jest.fn(() => ({})),
}));

// Мокаем DiveSitesLayer
jest.mock('../DiveSitesLayer', () => {
  return function MockDiveSitesLayer({ sites, selectedSite }: any) {
    return (
      <div data-testid="dive-sites-layer">
        <div data-testid="sites-count">{sites?.length || 0}</div>
        <div data-testid="selected-site">{selectedSite?.name || 'No site selected'}</div>
      </div>
    );
  };
});

// Мокаем Notification
jest.mock('@/components/ui', () => ({
  Notification: ({ show, message }: any) =>
    show ? <div data-testid="notification">{message}</div> : null,
}));

describe('MapContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: [],
      filteredDiveSites: [],
      selectedSite: null,
      loading: false,
      error: null,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
      autocompleteInfoMessage: null,
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
      setFetchDiveSiteDetailsCallback: mockSetFetchDiveSiteDetailsCallback,
    });
    mockUsePanel.mockReturnValue({
      showInfo: mockShowInfo,
      clearDiveSite: mockClearDiveSite,
      setClearDiveSiteHook: mockSetClearDiveSiteHook,
    });
    mockUseDiveSiteDetails.mockReturnValue({
      fetchDiveSiteDetails: mockFetchDiveSiteDetails,
      diveSite: null,
      clearDiveSite: mockClearDiveSiteHook,
    });
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
    });
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(<PanelProvider>{component}</PanelProvider>);
  };

  it('рендерит контейнер карты', () => {
    renderWithProviders(<MapContainer />);

    const mapContainer = document.querySelector('[class*="absolute inset-0"]');
    expect(mapContainer).toBeInTheDocument();
  });

  it('загружает дайв-сайты при монтировании', () => {
    renderWithProviders(<MapContainer />);

    expect(mockFetchDiveSites).toHaveBeenCalled();
  });

  it('инициализирует карту с правильными настройками', async () => {
    const { Map } = await import('maplibre-gl');

    renderWithProviders(<MapContainer />);

    expect(Map).toHaveBeenCalledWith({
      container: expect.any(HTMLElement),
      style: '/map-styles/arcgis_hybrid.json',
      center: [98.3774, 7.6079],
      zoom: 0,
      maxZoom: 15,
      minZoom: 0,
      hash: false,
      touchZoomRotate: true,
      doubleClickZoom: true,
      scrollZoom: true,
      keyboard: true,
      dragPan: true,
      dragRotate: true,
    });
  });

  it('добавляет элементы управления картой', () => {
    renderWithProviders(<MapContainer />);

    expect(mockMap.addControl).toHaveBeenCalledWith(
      expect.any(Object), // NavigationControl
      'top-right',
    );
    expect(mockMap.addControl).toHaveBeenCalledWith(
      expect.any(Object), // ScaleControl
    );
  });

  it('устанавливает карту в контекст', () => {
    renderWithProviders(<MapContainer />);

    expect(mockSetMap).toHaveBeenCalledWith(mockMap);
  });

  it('обрабатывает событие загрузки карты', () => {
    renderWithProviders(<MapContainer />);

    expect(mockMap.on).toHaveBeenCalledWith('load', expect.any(Function));

    // Симулируем вызов обработчика загрузки
    const loadHandler = mockMap.on.mock.calls.find((call) => call[0] === 'load')[1];
    loadHandler();

    expect(mockSetLoaded).toHaveBeenCalledWith(true);
  });

  it('очищает ресурсы при размонтировании', () => {
    const { unmount } = renderWithProviders(<MapContainer />);

    unmount();

    expect(mockSetLoaded).toHaveBeenCalledWith(false);
    expect(mockSetMap).toHaveBeenCalledWith(null);
    expect(mockMap.remove).toHaveBeenCalled();
  });

  it('отображает индикатор загрузки', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: [],
      filteredDiveSites: [],
      selectedSite: null,
      loading: true,
      error: null,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
      autocompleteInfoMessage: null,
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
      setFetchDiveSiteDetailsCallback: mockSetFetchDiveSiteDetailsCallback,
    });

    renderWithProviders(<MapContainer />);

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('отображает индикатор ошибки', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: [],
      filteredDiveSites: [],
      selectedSite: null,
      loading: false,
      error: 'Test error',
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
      autocompleteInfoMessage: null,
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
      setFetchDiveSiteDetailsCallback: mockSetFetchDiveSiteDetailsCallback,
    });

    renderWithProviders(<MapContainer />);

    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  it('передает правильные пропсы в DiveSitesLayer', () => {
    const mockSites = [{ id: '1', name: 'Site 1' }];
    const mockSelectedSite = { id: '1', name: 'Site 1' };

    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: mockSites,
      filteredDiveSites: mockSites,
      selectedSite: mockSelectedSite,
      loading: false,
      error: null,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
      autocompleteInfoMessage: null,
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
      setFetchDiveSiteDetailsCallback: mockSetFetchDiveSiteDetailsCallback,
    });

    renderWithProviders(<MapContainer />);

    expect(screen.getByTestId('dive-sites-layer')).toBeInTheDocument();
    expect(screen.getByTestId('sites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('selected-site')).toHaveTextContent('Site 1');
  });

  it('рендерит children', () => {
    renderWithProviders(
      <MapContainer>
        <div data-testid="test-child">Test Child</div>
      </MapContainer>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('имеет правильные CSS классы', () => {
    renderWithProviders(<MapContainer />);

    const container = screen.getByTestId('dive-sites-layer').parentElement;
    expect(container).toHaveClass('flex-1', 'relative');
  });

  it('обрабатывает отсутствие diveSites', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: null,
      filteredDiveSites: null,
      selectedSite: null,
      loading: false,
      error: null,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
      autocompleteInfoMessage: null,
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
      setFetchDiveSiteDetailsCallback: mockSetFetchDiveSiteDetailsCallback,
    });

    renderWithProviders(<MapContainer />);

    expect(screen.getByTestId('sites-count')).toHaveTextContent('0');
  });

  it('обрабатывает отсутствие selectedSite', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: [],
      filteredDiveSites: [],
      selectedSite: null,
      loading: false,
      error: null,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
      autocompleteInfoMessage: null,
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
      setFetchDiveSiteDetailsCallback: mockSetFetchDiveSiteDetailsCallback,
    });

    renderWithProviders(<MapContainer />);

    expect(screen.getByTestId('selected-site')).toHaveTextContent('No site selected');
  });

  it('показывает уведомление когда нет результатов после фильтрации', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: [],
      filteredDiveSites: [],
      selectedSite: null,
      loading: false,
      error: null,
      activeFilters: {
        siteTypeIds: [1],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
      autocompleteInfoMessage: null,
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
      setFetchDiveSiteDetailsCallback: mockSetFetchDiveSiteDetailsCallback,
    });

    renderWithProviders(<MapContainer />);

    expect(screen.getByTestId('notification')).toBeInTheDocument();
    expect(screen.getByTestId('notification')).toHaveTextContent('notification.noResults');
  });

  it('не показывает уведомление когда нет активных фильтров', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: [],
      filteredDiveSites: [],
      selectedSite: null,
      loading: false,
      error: null,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
      autocompleteInfoMessage: null,
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
      setFetchDiveSiteDetailsCallback: mockSetFetchDiveSiteDetailsCallback,
    });

    renderWithProviders(<MapContainer />);

    expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
  });

  it('не показывает уведомление во время загрузки', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: [],
      filteredDiveSites: [],
      selectedSite: null,
      loading: true,
      error: null,
      activeFilters: {
        siteTypeIds: [1],
        difficultyIds: [],
        maxDepth: null,
        minVisibility: null,
      },
      autocompleteInfoMessage: null,
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
      setFetchDiveSiteDetailsCallback: mockSetFetchDiveSiteDetailsCallback,
    });

    renderWithProviders(<MapContainer />);

    expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
  });
});
