/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapContainer from '../MapContainer';

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
const mockUseMap = jest.fn();

jest.mock('@/contexts/MapContext', () => ({
  useMap: () => mockUseMap(),
}));

// Мокаем maplibre-gl
const mockMap = {
  on: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  addControl: jest.fn(),
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
      },
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
    });
  });

  it('рендерит контейнер карты', () => {
    render(<MapContainer />);

    const mapContainer = document.querySelector('[class*="absolute inset-0"]');
    expect(mapContainer).toBeInTheDocument();
  });

  it('загружает дайв-сайты при монтировании', () => {
    render(<MapContainer />);

    expect(mockFetchDiveSites).toHaveBeenCalled();
  });

  it('инициализирует карту с правильными настройками', async () => {
    const { Map } = await import('maplibre-gl');

    render(<MapContainer />);

    expect(Map).toHaveBeenCalledWith({
      container: expect.any(HTMLElement),
      style: '/map-styles/arcgis_hybrid.json',
      center: [98.379111, 7.609361],
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
    render(<MapContainer />);

    expect(mockMap.addControl).toHaveBeenCalledWith(
      expect.any(Object), // NavigationControl
      'top-right',
    );
    expect(mockMap.addControl).toHaveBeenCalledWith(
      expect.any(Object), // ScaleControl
    );
  });

  it('устанавливает карту в контекст', () => {
    render(<MapContainer />);

    expect(mockSetMap).toHaveBeenCalledWith(mockMap);
  });

  it('обрабатывает событие загрузки карты', () => {
    render(<MapContainer />);

    expect(mockMap.on).toHaveBeenCalledWith('load', expect.any(Function));

    // Симулируем вызов обработчика загрузки
    const loadHandler = mockMap.on.mock.calls.find((call) => call[0] === 'load')[1];
    loadHandler();

    expect(mockSetLoaded).toHaveBeenCalledWith(true);
  });

  it('очищает ресурсы при размонтировании', () => {
    const { unmount } = render(<MapContainer />);

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
      },
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
    });

    render(<MapContainer />);

    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
    expect(loadingIndicator).toHaveTextContent('map.loading');
  });

  it('отображает индикатор ошибки', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: [],
      filteredDiveSites: [],
      selectedSite: null,
      loading: false,
      error: 'Test error message',
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
      },
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
    });

    render(<MapContainer />);

    const errorIndicator = screen.getByText('Error: Test error message');
    expect(errorIndicator).toBeInTheDocument();
    expect(errorIndicator).toHaveClass('bg-red-100', 'border-red-400', 'text-red-700');
  });

  it('передает правильные пропсы в DiveSitesLayer', () => {
    const mockSites = [
      { id: 1, name: 'Site 1' },
      { id: 2, name: 'Site 2' },
    ];
    const mockSelectedSite = { id: 1, name: 'Selected Site' };

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
      },
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
    });

    render(<MapContainer />);

    expect(screen.getByTestId('sites-count')).toHaveTextContent('2');
    expect(screen.getByTestId('selected-site')).toHaveTextContent('Selected Site');
  });

  it('рендерит children', () => {
    render(
      <MapContainer>
        <div data-testid="child-component">Child Content</div>
      </MapContainer>,
    );

    expect(screen.getByTestId('child-component')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('имеет правильные CSS классы', () => {
    render(<MapContainer />);

    const container = screen.getByTestId('dive-sites-layer').parentElement;
    expect(container).toHaveClass('flex-1', 'relative');
  });

  it('обрабатывает отсутствие diveSites', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: null,
      filteredDiveSites: [],
      selectedSite: null,
      loading: false,
      error: null,
      activeFilters: {
        siteTypeIds: [],
        difficultyIds: [],
      },
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
    });

    render(<MapContainer />);

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
      },
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
    });

    render(<MapContainer />);

    expect(screen.getByTestId('selected-site')).toHaveTextContent('No site selected');
  });

  it('показывает сообщение когда нет результатов после фильтрации', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: [
        { id: 1, name: 'Site 1', site_type_id: 1, difficulty_id: 1 },
        { id: 2, name: 'Site 2', site_type_id: 2, difficulty_id: 2 },
      ],
      filteredDiveSites: [], // Отфильтрованные сайты пустые
      selectedSite: null,
      loading: false,
      error: null,
      activeFilters: {
        siteTypeIds: [3], // Активный фильтр, который не соответствует ни одному сайту
        difficultyIds: [],
      },
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
    });

    render(<MapContainer />);

    expect(screen.getByTestId('no-results-message')).toBeInTheDocument();
    expect(screen.getByText('map.noResults')).toBeInTheDocument();
    expect(screen.getByText('map.tryChangeFilters')).toBeInTheDocument();
  });

  it('не показывает сообщение когда нет активных фильтров', () => {
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
      },
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
    });

    render(<MapContainer />);

    expect(screen.queryByTestId('no-results-message')).not.toBeInTheDocument();
  });

  it('не показывает сообщение во время загрузки', () => {
    mockUseMap.mockReturnValue({
      setMap: mockSetMap,
      setLoaded: mockSetLoaded,
      diveSites: [],
      filteredDiveSites: [],
      selectedSite: null,
      loading: true, // Загрузка активна
      error: null,
      activeFilters: {
        siteTypeIds: [1],
        difficultyIds: [],
      },
      fetchDiveSites: mockFetchDiveSites,
      onSiteClick: mockOnSiteClick,
      onClusterClick: mockOnClusterClick,
    });

    render(<MapContainer />);

    expect(screen.queryByTestId('no-results-message')).not.toBeInTheDocument();
  });
});
