import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarkerCluster from '../MarkerCluster';
import { Cluster } from '@/types/clustering';

// Мокаем react-i18next
const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('MarkerCluster', () => {
  const mockCluster: Cluster = {
    id: 'cluster-1',
    center: [20.5678, 10.1234],
    count: 15,
    points: [
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
    ],
    bounds: {
      minLng: 20,
      maxLng: 21,
      minLat: 10,
      maxLat: 11,
    },
  };

  const mockOnClick = jest.fn();
  const mockOnHover = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'map.markers.diveSites': 'дайв-сайтов',
          'map.markers.diveSiteSingular': 'дайв-сайт',
          'map.markers.diveSitePlural': 'дайв-сайтов',
          'map.markers.clickToZoom': 'Нажмите для увеличения',
        };
        return translations[key] || key;
      },
    });
  });

  it('рендерит кластер с правильными данными', () => {
    render(<MarkerCluster cluster={mockCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    const cluster = screen.getByTestId('marker-cluster');
    expect(cluster).toBeInTheDocument();
    expect(cluster).toHaveTextContent('15');
  });

  it('имеет правильные атрибуты доступности', () => {
    render(<MarkerCluster cluster={mockCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    const cluster = screen.getByRole('button');
    expect(cluster).toHaveAttribute('aria-label', 'Cluster with 15 дайв-сайтов');
    expect(cluster).toHaveAttribute('tabIndex', '0');
  });

  it('обрабатывает клик по кластеру', () => {
    render(<MarkerCluster cluster={mockCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    const cluster = screen.getByTestId('marker-cluster');
    fireEvent.click(cluster);

    expect(mockOnClick).toHaveBeenCalledWith(mockCluster);
  });

  it('обрабатывает наведение мыши', () => {
    render(<MarkerCluster cluster={mockCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    const cluster = screen.getByTestId('marker-cluster');
    fireEvent.mouseEnter(cluster);

    expect(mockOnHover).toHaveBeenCalledWith(mockCluster);
  });

  it('показывает tooltip при наведении', () => {
    render(<MarkerCluster cluster={mockCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    const cluster = screen.getByTestId('marker-cluster');
    fireEvent.mouseEnter(cluster);

    expect(screen.getByText('15 дайв-сайтов')).toBeInTheDocument();
    expect(screen.getByText('Нажмите для увеличения')).toBeInTheDocument();
  });

  it('показывает tooltip при активном состоянии', () => {
    render(
      <MarkerCluster
        cluster={mockCluster}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    expect(screen.getByText('15 дайв-сайтов')).toBeInTheDocument();
    expect(screen.getByText('Нажмите для увеличения')).toBeInTheDocument();
  });

  it('скрывает tooltip при уходе мыши', () => {
    render(<MarkerCluster cluster={mockCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    const cluster = screen.getByTestId('marker-cluster');
    fireEvent.mouseEnter(cluster);
    expect(screen.getByText('15 дайв-сайтов')).toBeInTheDocument();

    fireEvent.mouseLeave(cluster);
    expect(screen.queryByText('15 дайв-сайтов')).not.toBeInTheDocument();
  });

  it('форматирует количество точек правильно', () => {
    const largeCluster: Cluster = {
      ...mockCluster,
      count: 1500,
    };

    render(<MarkerCluster cluster={largeCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    expect(screen.getByTestId('marker-cluster')).toHaveTextContent('2k');
  });

  it('форматирует количество точек для сотен', () => {
    const hundredCluster: Cluster = {
      ...mockCluster,
      count: 150,
    };

    render(<MarkerCluster cluster={hundredCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    expect(screen.getByTestId('marker-cluster')).toHaveTextContent('200+');
  });

  it('определяет размер кластера на основе количества точек', () => {
    const smallCluster: Cluster = {
      ...mockCluster,
      count: 5,
    };

    const { rerender } = render(
      <MarkerCluster cluster={smallCluster} onClick={mockOnClick} onHover={mockOnHover} />,
    );

    let cluster = screen.getByTestId('marker-cluster');
    expect(cluster).toHaveClass('w-8', 'h-8');

    const largeCluster: Cluster = {
      ...mockCluster,
      count: 150,
    };

    rerender(<MarkerCluster cluster={largeCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    cluster = screen.getByTestId('marker-cluster');
    expect(cluster).toHaveClass('w-12', 'h-12');
  });

  it('определяет цвет кластера на основе количества точек', () => {
    const smallCluster: Cluster = {
      ...mockCluster,
      count: 5,
    };

    const { rerender } = render(
      <MarkerCluster cluster={smallCluster} onClick={mockOnClick} onHover={mockOnHover} />,
    );

    let cluster = screen.getByTestId('marker-cluster');
    expect(cluster).toHaveClass('bg-gradient-to-r', 'from-green-500', 'to-emerald-600');

    const largeCluster: Cluster = {
      ...mockCluster,
      count: 150,
    };

    rerender(<MarkerCluster cluster={largeCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    cluster = screen.getByTestId('marker-cluster');
    expect(cluster).toHaveClass('bg-gradient-coral');
  });

  it('показывает правильное склонение для единственного числа', () => {
    const singleCluster: Cluster = {
      ...mockCluster,
      count: 1,
    };

    render(<MarkerCluster cluster={singleCluster} onClick={mockOnClick} onHover={mockOnHover} />);

    const cluster = screen.getByTestId('marker-cluster');
    fireEvent.mouseEnter(cluster);

    expect(screen.getByText('1 дайв-сайт')).toBeInTheDocument();
  });

  it('имеет правильные CSS классы для активного состояния', () => {
    render(
      <MarkerCluster
        cluster={mockCluster}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const container = screen.getByRole('button');
    expect(container).toHaveClass('ring-4', 'ring-coral/30');
  });

  it('имеет правильные CSS классы для неактивного состояния', () => {
    render(
      <MarkerCluster
        cluster={mockCluster}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={false}
      />,
    );

    const container = screen.getByRole('button');
    expect(container).not.toHaveClass('ring-4', 'ring-coral/30');
  });

  it('показывает пульсирующую анимацию для активного кластера', () => {
    render(
      <MarkerCluster
        cluster={mockCluster}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const pulseElement = screen.getByRole('button').querySelector('.animate-ping');
    expect(pulseElement).toBeInTheDocument();
    expect(pulseElement).toHaveClass('bg-coral/75');
  });
});
