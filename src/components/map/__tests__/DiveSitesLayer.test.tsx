/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiveSitesLayer from '../DiveSitesLayer';
import { Site } from '@/types/database';
import { Cluster } from '@/types/clustering';

// Мокаем maplibre-gl
const mockMap = {
  getBounds: jest.fn(() => ({
    getWest: () => -180,
    getEast: () => 180,
    getSouth: () => -90,
    getNorth: () => 90,
  })),
  getZoom: jest.fn(() => 10),
  project: jest.fn(([lng, lat]) => ({ x: lng * 100, y: lat * 100 })),
  on: jest.fn(),
  off: jest.fn(),
  fitBounds: jest.fn(),
};

// Мокаем ClusteringManager
const mockClusteringManager = {
  cluster: jest.fn(() => []),
  cleanup: jest.fn(),
};

jest.mock('@/lib/clustering/ClusteringManager', () => ({
  ClusteringManager: jest.fn().mockImplementation(() => mockClusteringManager),
}));

// Мокаем PerformanceOptimizer
const mockPerformanceOptimizer = {
  throttle: jest.fn((fn) => fn),
};

jest.mock('@/lib/clustering/PerformanceOptimizer', () => ({
  PerformanceOptimizer: jest.fn().mockImplementation(() => mockPerformanceOptimizer),
}));

// Мокаем DiveSiteMarker
jest.mock('../DiveSiteMarker', () => {
  return function MockDiveSiteMarker({ site, onClick, isActive }: any) {
    return (
      <div
        data-testid={`dive-site-marker-${site.id}`}
        onClick={() => onClick?.(site)}
        className={isActive ? 'active' : 'inactive'}
      >
        {site.name}
      </div>
    );
  };
});

// Мокаем MarkerCluster
jest.mock('../MarkerCluster', () => {
  return function MockMarkerCluster({ cluster, onClick }: any) {
    return (
      <div data-testid={`marker-cluster-${cluster.id}`} onClick={() => onClick?.(cluster)}>
        Cluster {cluster.count}
      </div>
    );
  };
});

describe('DiveSitesLayer', () => {
  const mockSites: Site[] = [
    {
      id: 1,
      name: 'Test Site 1',
      latitude: 10.1234,
      longitude: 20.5678,
      rating: 4.5,
      site_type: {
        label_en: 'Reef',
        label_ru: 'Риф',
      },
    },
    {
      id: 2,
      name: 'Test Site 2',
      latitude: 11.1234,
      longitude: 21.5678,
      rating: 4.0,
      site_type: {
        label_en: 'Wreck',
        label_ru: 'Затонувший корабль',
      },
    },
  ];

  const mockSelectedSite: Site | null = null;
  const mockOnSiteClick = jest.fn();
  const mockOnClusterClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит компонент с картой', () => {
    render(
      <DiveSitesLayer
        map={mockMap as any}
        sites={mockSites}
        selectedSite={mockSelectedSite}
        onSiteClick={mockOnSiteClick}
        onClusterClick={mockOnClusterClick}
      />,
    );

    expect(screen.getByTestId('dive-site-marker-1')).toBeInTheDocument();
    expect(screen.getByTestId('dive-site-marker-2')).toBeInTheDocument();
  });

  it('не рендерит ничего без карты', () => {
    const { container } = render(
      <DiveSitesLayer
        map={null}
        sites={mockSites}
        selectedSite={mockSelectedSite}
        onSiteClick={mockOnSiteClick}
        onClusterClick={mockOnClusterClick}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('обрабатывает клик по сайту', () => {
    render(
      <DiveSitesLayer
        map={mockMap as any}
        sites={mockSites}
        selectedSite={mockSelectedSite}
        onSiteClick={mockOnSiteClick}
        onClusterClick={mockOnClusterClick}
      />,
    );

    const marker = screen.getByTestId('dive-site-marker-1');
    fireEvent.click(marker);

    expect(mockOnSiteClick).toHaveBeenCalledWith(mockSites[0]);
  });

  it('обрабатывает клик по кластеру', () => {
    const mockCluster: Cluster = {
      id: 'cluster-1',
      center: [20, 10],
      count: 5,
      points: mockSites,
      bounds: {
        minLng: 20,
        maxLng: 21,
        minLat: 10,
        maxLat: 11,
      },
    };

    // Мокаем кластеризацию
    mockClusteringManager.cluster.mockReturnValue([mockCluster]);

    render(
      <DiveSitesLayer
        map={mockMap as any}
        sites={mockSites}
        selectedSite={mockSelectedSite}
        onSiteClick={mockOnSiteClick}
        onClusterClick={mockOnClusterClick}
      />,
    );

    const cluster = screen.getByTestId('marker-cluster-cluster-1');
    fireEvent.click(cluster);

    expect(mockOnClusterClick).toHaveBeenCalledWith(mockCluster);
    expect(mockMap.fitBounds).toHaveBeenCalled();
  });

  it('показывает активный сайт', () => {
    // Сбрасываем мок кластеризации для этого теста
    mockClusteringManager.cluster.mockReturnValue([]);

    render(
      <DiveSitesLayer
        map={mockMap as any}
        sites={mockSites}
        selectedSite={mockSites[0]}
        onSiteClick={mockOnSiteClick}
        onClusterClick={mockOnClusterClick}
      />,
    );

    const activeMarker = screen.getByTestId('dive-site-marker-1');
    expect(activeMarker).toHaveClass('active');
  });

  it('очищает состояние при пустых данных', () => {
    render(
      <DiveSitesLayer
        map={mockMap as any}
        sites={[]}
        selectedSite={mockSelectedSite}
        onSiteClick={mockOnSiteClick}
        onClusterClick={mockOnClusterClick}
      />,
    );

    expect(screen.queryByTestId('dive-site-marker-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dive-site-marker-2')).not.toBeInTheDocument();
  });

  it('обрабатывает ошибки кластеризации', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockClusteringManager.cluster.mockImplementation(() => {
      throw new Error('Clustering error');
    });

    render(
      <DiveSitesLayer
        map={mockMap as any}
        sites={mockSites}
        selectedSite={mockSelectedSite}
        onSiteClick={mockOnSiteClick}
        onClusterClick={mockOnClusterClick}
      />,
    );

    // Ждем выполнения useEffect
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Проверяем, что ошибка была залогирована
    expect(consoleSpy).toHaveBeenCalledWith('Error during clustering:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('фильтрует невидимые точки', () => {
    // Мокаем isPointVisible для возврата false
    mockMap.project.mockImplementation(() => {
      // Возвращаем координаты за пределами видимой области
      return { x: -1000, y: -1000 };
    });

    render(
      <DiveSitesLayer
        map={mockMap as any}
        sites={mockSites}
        selectedSite={mockSelectedSite}
        onSiteClick={mockOnSiteClick}
        onClusterClick={mockOnClusterClick}
      />,
    );

    // Точки должны быть отфильтрованы и не отображаться
    expect(screen.queryByTestId('dive-site-marker-1')).not.toBeInTheDocument();
  });

  it('подписывается на события карты', () => {
    render(
      <DiveSitesLayer
        map={mockMap as any}
        sites={mockSites}
        selectedSite={mockSelectedSite}
        onSiteClick={mockOnSiteClick}
        onClusterClick={mockOnClusterClick}
      />,
    );

    expect(mockMap.on).toHaveBeenCalledWith('move', expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledWith('zoom', expect.any(Function));
  });

  it('отписывается от событий карты при размонтировании', () => {
    const { unmount } = render(
      <DiveSitesLayer
        map={mockMap as any}
        sites={mockSites}
        selectedSite={mockSelectedSite}
        onSiteClick={mockOnSiteClick}
        onClusterClick={mockOnClusterClick}
      />,
    );

    unmount();

    expect(mockMap.off).toHaveBeenCalledWith('move', expect.any(Function));
    expect(mockMap.off).toHaveBeenCalledWith('zoom', expect.any(Function));
  });
});
