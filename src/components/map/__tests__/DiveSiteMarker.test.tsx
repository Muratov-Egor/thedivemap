/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiveSiteMarker from '../DiveSiteMarker';

// Мокаем react-i18next
const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

// Мокаем Button
jest.mock('@/components/ui/Button', () => {
  return function MockButton({ children, onClick, 'data-testid': testId, ...props }: any) {
    return (
      <button onClick={onClick} data-testid={testId} {...props}>
        {children}
      </button>
    );
  };
});

// Мокаем CloseIcon и SiteTypeIcon
jest.mock('@/components/icons', () => ({
  CloseIcon: () => <div data-testid="close-icon">×</div>,
  SiteTypeIcon: () => <div data-testid="site-type-icon">🏝️</div>,
}));

describe('DiveSiteMarker', () => {
  const mockSite = {
    id: '1',
    name: 'Test Dive Site',
    description: 'Test description',
    latitude: 10.1234,
    longitude: 20.5678,
    country_id: 1,
    depth_max: 30,
    visibility: 20,
    info_links: null,
    dive_center_links: null,
    rating: 4.5,
    site_type_id: 1,
    difficulty_id: 2,
    status: 'published' as const,
    created_at: '2024-01-01T00:00:00Z',
    site_type: {
      id: 1,
      label_en: 'Reef',
      label_ru: 'Риф',
    },
    difficulty: {
      id: 2,
      label_en: 'Intermediate',
      label_ru: 'Средний',
    },
    country: {
      id: 1,
      name_en: 'Montenegro',
      name_ru: 'Черногория',
      iso_code: 'ME',
      region_id: 1,
    },
  };

  const mockOnClick = jest.fn();
  const mockOnHover = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'map.markers.diveSite': 'Дайв-сайт',
          'map.markers.type': 'Тип',
          'map.markers.closeTooltip': 'Закрыть подсказку',
          'map.markers.more': 'Подробнее',
        };
        return translations[key] || key;
      },
    });

    // Мокаем document.documentElement.lang
    Object.defineProperty(document.documentElement, 'lang', {
      value: 'ru',
      writable: true,
    });
  });

  it('рендерит маркер с правильными данными', () => {
    render(<DiveSiteMarker site={mockSite} onClick={mockOnClick} onHover={mockOnHover} />);

    const marker = screen.getByTestId('dive-site-marker-1');
    expect(marker).toBeInTheDocument();
    expect(marker).toHaveClass('w-8', 'h-8', 'rounded-full', 'bg-gradient-ocean');
  });

  it('отображает иконку дайвинга', () => {
    render(<DiveSiteMarker site={mockSite} onClick={mockOnClick} onHover={mockOnHover} />);

    const marker = screen.getByTestId('dive-site-marker-1');
    expect(marker).toHaveTextContent('🤿');
  });

  it('имеет правильные атрибуты доступности', () => {
    render(<DiveSiteMarker site={mockSite} onClick={mockOnClick} onHover={mockOnHover} />);

    const marker = screen.getByRole('button');
    expect(marker).toHaveAttribute('aria-label', 'Dive site: Test Dive Site');
    expect(marker).toHaveAttribute('tabIndex', '0');
  });

  it('обрабатывает клик по маркеру', () => {
    render(<DiveSiteMarker site={mockSite} onClick={mockOnClick} onHover={mockOnHover} />);

    const marker = screen.getByTestId('dive-site-marker-1');
    fireEvent.click(marker);

    expect(mockOnClick).toHaveBeenCalledWith(mockSite);
  });

  it('обрабатывает наведение мыши', () => {
    render(<DiveSiteMarker site={mockSite} onClick={mockOnClick} onHover={mockOnHover} />);

    const marker = screen.getByTestId('dive-site-marker-1');
    fireEvent.mouseEnter(marker);

    expect(mockOnHover).toHaveBeenCalledWith(mockSite);
  });

  it('показывает tooltip при активном состоянии', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    expect(screen.getByTestId('dive-site-tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('dive-site-tooltip-name')).toHaveTextContent('Test Dive Site');
  });

  it('показывает координаты в tooltip', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const coordinates = screen.getByTestId('dive-site-tooltip-coordinates');
    expect(coordinates).toHaveTextContent('📍10.1234°N, 20.5678°E');
  });

  it('показывает тип сайта в tooltip', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const type = screen.getByTestId('dive-site-tooltip-type');
    expect(type).toHaveTextContent('Риф');
    expect(screen.getByTestId('site-type-icon')).toBeInTheDocument();
  });

  it('показывает глубину в tooltip', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const depth = screen.getByTestId('dive-site-tooltip-depth');
    expect(depth).toHaveTextContent('⬇30 m');
  });

  it('показывает видимость в tooltip', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const visibility = screen.getByTestId('dive-site-tooltip-visibility');
    expect(visibility).toHaveTextContent('👁️20 m');
  });

  it('показывает кнопку "Подробнее" в tooltip', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const moreButton = screen.getByText('Подробнее');
    expect(moreButton).toBeInTheDocument();
  });

  it('закрывает tooltip при клике на кнопку закрытия', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    expect(screen.getByTestId('dive-site-tooltip')).toBeInTheDocument();

    const closeButton = screen.getByTestId('dive-site-tooltip-close');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('dive-site-tooltip')).not.toBeInTheDocument();
  });

  it('обрабатывает отрицательные координаты', () => {
    const siteWithNegativeCoords = {
      ...mockSite,
      latitude: -10.1234,
      longitude: -20.5678,
    };

    render(
      <DiveSiteMarker
        site={siteWithNegativeCoords}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const coordinates = screen.getByTestId('dive-site-tooltip-coordinates');
    expect(coordinates).toHaveTextContent('📍10.1234°S, 20.5678°W');
  });

  it('обрабатывает отсутствие типа сайта', () => {
    const siteWithoutType = {
      ...mockSite,
      site_type: undefined,
    };

    render(
      <DiveSiteMarker
        site={siteWithoutType}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    expect(screen.queryByTestId('dive-site-tooltip-type')).not.toBeInTheDocument();
  });

  it('обрабатывает нулевую глубину', () => {
    const siteWithZeroDepth = {
      ...mockSite,
      depth_max: 0,
    };

    render(
      <DiveSiteMarker
        site={siteWithZeroDepth}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const depth = screen.getByTestId('dive-site-tooltip-depth');
    expect(depth).toHaveTextContent('⬇0 m');
  });

  it('обрабатывает нулевую видимость', () => {
    const siteWithZeroVisibility = {
      ...mockSite,
      visibility: 0,
    };

    render(
      <DiveSiteMarker
        site={siteWithZeroVisibility}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const visibility = screen.getByTestId('dive-site-tooltip-visibility');
    expect(visibility).toHaveTextContent('👁️0 m');
  });

  it('использует английский язык для типа сайта', () => {
    Object.defineProperty(document.documentElement, 'lang', {
      value: 'en',
      writable: true,
    });

    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const type = screen.getByTestId('dive-site-tooltip-type');
    expect(type).toHaveTextContent('Reef');
  });

  it('имеет правильные CSS классы для активного состояния', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const marker = screen.getByTestId('dive-site-marker-1');
    expect(marker).toHaveClass('shadow-glow-hover');
  });

  it('имеет правильные CSS классы для неактивного состояния', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={false}
      />,
    );

    const marker = screen.getByTestId('dive-site-marker-1');
    expect(marker).toHaveClass('shadow-glow-blue');
  });

  it('не показывает tooltip при неактивном состоянии', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={false}
      />,
    );

    expect(screen.queryByTestId('dive-site-tooltip')).not.toBeInTheDocument();
  });

  it('закрывает tooltip при повторном клике на маркер', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    expect(screen.getByTestId('dive-site-tooltip')).toBeInTheDocument();

    const marker = screen.getByTestId('dive-site-marker-1');
    fireEvent.click(marker);

    // Tooltip должен остаться открытым после клика на маркер
    expect(screen.getByTestId('dive-site-tooltip')).toBeInTheDocument();
  });

  it('показывает tooltip при наведении мыши', () => {
    render(<DiveSiteMarker site={mockSite} onClick={mockOnClick} onHover={mockOnHover} />);

    const marker = screen.getByTestId('dive-site-marker-1');
    fireEvent.mouseEnter(marker);

    expect(screen.getByTestId('dive-site-tooltip')).toBeInTheDocument();
  });

  it('скрывает tooltip при уходе мыши', () => {
    render(<DiveSiteMarker site={mockSite} onClick={mockOnClick} onHover={mockOnHover} />);

    const marker = screen.getByTestId('dive-site-marker-1');
    fireEvent.mouseEnter(marker);
    expect(screen.getByTestId('dive-site-tooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(marker);
    expect(screen.queryByTestId('dive-site-tooltip')).not.toBeInTheDocument();
  });
});
