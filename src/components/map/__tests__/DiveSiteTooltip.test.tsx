import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n.client';
import DiveSiteTooltip from '../DiveSiteTooltip';

// Мок для дайв-сайта
const mockSite = {
  id: '1',
  name: 'Test Dive Site',
  description: 'Test description',
  latitude: 42.1234,
  longitude: 18.5678,
  country_id: 1,
  depth_max: 30,
  visibility: 20,
  info_links: null,
  dive_center_links: null,
  rating: 4,
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

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe('DiveSiteTooltip', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает название дайв-сайта', () => {
    renderWithI18n(<DiveSiteTooltip site={mockSite} onClose={mockOnClose} />);

    expect(screen.getByTestId('dive-site-tooltip-name')).toHaveTextContent('Test Dive Site');
  });

  it('отображает координаты', () => {
    renderWithI18n(<DiveSiteTooltip site={mockSite} onClose={mockOnClose} />);

    expect(screen.getByTestId('dive-site-tooltip-coordinates')).toHaveTextContent(
      '📍 42.1234°N, 18.5678°E',
    );
  });

  it('отображает тип сайта', () => {
    renderWithI18n(<DiveSiteTooltip site={mockSite} onClose={mockOnClose} />);

    expect(screen.getByTestId('dive-site-tooltip-type')).toHaveTextContent(
      /map\.markers\.type.*риф/i,
    );
  });

  it('отображает рейтинг', () => {
    renderWithI18n(<DiveSiteTooltip site={mockSite} onClose={mockOnClose} />);

    expect(screen.getByTestId('dive-site-tooltip-rating')).toHaveTextContent('⭐️ 4/5');
  });

  it('не отображает рейтинг если он равен 0', () => {
    const siteWithoutRating = { ...mockSite, rating: 0 };

    renderWithI18n(<DiveSiteTooltip site={siteWithoutRating} onClose={mockOnClose} />);

    expect(screen.queryByTestId('dive-site-tooltip-rating')).not.toBeInTheDocument();
  });

  it('не отображает тип сайта если он отсутствует', () => {
    const siteWithoutType = { ...mockSite, site_type: undefined };

    renderWithI18n(<DiveSiteTooltip site={siteWithoutType} onClose={mockOnClose} />);

    expect(screen.queryByTestId('dive-site-tooltip-type')).not.toBeInTheDocument();
  });

  it('вызывает onClose при клике на кнопку закрытия', () => {
    renderWithI18n(<DiveSiteTooltip site={mockSite} onClose={mockOnClose} />);

    const closeButton = screen.getByTestId('dive-site-tooltip-close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('имеет правильную структуру и стили', () => {
    renderWithI18n(<DiveSiteTooltip site={mockSite} onClose={mockOnClose} />);

    const tooltip = screen.getByTestId('dive-site-tooltip');

    expect(tooltip).toHaveClass(
      'absolute',
      'bottom-full',
      'left-1/2',
      'transform',
      '-translate-x-1/2',
      'mb-2',
      'px-3',
      'py-2',
      'rounded-lg',
      'text-sm',
      'whitespace-nowrap',
      'z-20',
      'bg-white/90',
      'backdrop-blur-sm',
      'border',
      'border-white/20',
      'shadow-lg',
      'shadow-black/10',
      'transition-all',
      'duration-300',
      'ease-out',
      'opacity-100',
      'scale-100',
    );
  });

  it('отображает стрелку tooltip', () => {
    renderWithI18n(<DiveSiteTooltip site={mockSite} onClose={mockOnClose} />);

    const tooltip = screen.getByTestId('dive-site-tooltip');
    const arrow = tooltip.querySelector('div[class*="border-t-white"]');

    expect(arrow).toHaveClass(
      'absolute',
      'top-full',
      'left-1/2',
      'transform',
      '-translate-x-1/2',
      'w-0',
      'h-0',
      'border-l-8',
      'border-r-8',
      'border-t-8',
      'border-transparent',
      'border-t-white',
    );
  });
});
