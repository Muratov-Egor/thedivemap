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

// Мокаем CloseIcon
jest.mock('@/components/icons', () => ({
  CloseIcon: () => <div data-testid="close-icon">×</div>,
}));

describe('DiveSiteMarker', () => {
  const mockSite = {
    id: 1,
    name: 'Test Dive Site',
    latitude: 10.1234,
    longitude: 20.5678,
    rating: 4.5,
    site_type: {
      label_en: 'Reef',
      label_ru: 'Риф',
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
    expect(marker).toHaveAttribute('aria-label', 'Дайв-сайт: Test Dive Site');
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
    expect(coordinates).toHaveTextContent('📍 10.1234°N, 20.5678°E');
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
    expect(type).toHaveTextContent('Тип: Риф');
  });

  it('показывает рейтинг в tooltip', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const rating = screen.getByTestId('dive-site-tooltip-rating');
    expect(rating).toHaveTextContent('⭐️ 4.5/5');
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

  it('не показывает tooltip если он был закрыт вручную', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    const closeButton = screen.getByTestId('dive-site-tooltip-close');
    fireEvent.click(closeButton);

    // Даже при активном состоянии tooltip не должен показываться
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
    expect(coordinates).toHaveTextContent('📍 10.1234°S, 20.5678°W');
  });

  it('обрабатывает отсутствие типа сайта', () => {
    const siteWithoutType = {
      ...mockSite,
      site_type: null,
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

  it('обрабатывает отсутствие рейтинга', () => {
    const siteWithoutRating = {
      ...mockSite,
      rating: 0,
    };

    render(
      <DiveSiteMarker
        site={siteWithoutRating}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    expect(screen.queryByTestId('dive-site-tooltip-rating')).not.toBeInTheDocument();
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
    expect(type).toHaveTextContent('Тип: Reef');
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

  it('сбрасывает состояние закрытия при новом клике', () => {
    render(
      <DiveSiteMarker
        site={mockSite}
        onClick={mockOnClick}
        onHover={mockOnHover}
        isActive={true}
      />,
    );

    // Закрываем tooltip
    const closeButton = screen.getByTestId('dive-site-tooltip-close');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('dive-site-tooltip')).not.toBeInTheDocument();

    // Кликаем на маркер - tooltip должен появиться снова
    const marker = screen.getByTestId('dive-site-marker-1');
    fireEvent.click(marker);
    expect(screen.getByTestId('dive-site-tooltip')).toBeInTheDocument();
  });
});
