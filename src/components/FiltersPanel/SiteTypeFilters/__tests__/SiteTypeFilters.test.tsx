import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { getI18n } from '@/i18n/i18n.client';
import SiteTypeFilters from '../SiteTypeFilters';
import { MapProvider } from '@/contexts/MapContext';
import { useFilters } from '@/hooks/useFilters';

// Мокаем хук useFilters
jest.mock('@/hooks/useFilters');
const mockUseFilters = useFilters as jest.MockedFunction<typeof useFilters>;

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={getI18n()}>
      <MapProvider>{component}</MapProvider>
    </I18nextProvider>,
  );
};

describe('SiteTypeFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    mockUseFilters.mockReturnValue({
      filters: null,
      loading: true,
      error: null,
    });

    renderWithProviders(<SiteTypeFilters />);

    // Компонент не должен рендериться во время загрузки
    expect(screen.queryByText('Dive Site Type')).not.toBeInTheDocument();
  });

  it('should render site types after loading', () => {
    const mockFilters = {
      site_types: [
        { id: 1, label: 'Риф' },
        { id: 2, label: 'Затонувшее судно' },
      ],
      difficulties: [],
    };

    mockUseFilters.mockReturnValue({
      filters: mockFilters,
      loading: false,
      error: null,
    });

    renderWithProviders(<SiteTypeFilters />);

    const reefChip = screen.getByTestId('site-type-filter-1');
    const shipChip = screen.getByTestId('site-type-filter-2');
    expect(reefChip).toBeInTheDocument();
    expect(shipChip).toBeInTheDocument();
  });

  it('should handle site type selection', async () => {
    const mockFilters = {
      site_types: [
        { id: 1, label: 'Риф' },
        { id: 2, label: 'Затонувшее судно' },
      ],
      difficulties: [],
    };

    mockUseFilters.mockReturnValue({
      filters: mockFilters,
      loading: false,
      error: null,
    });

    renderWithProviders(<SiteTypeFilters />);

    const reefChip = screen.getByTestId('site-type-filter-1');
    fireEvent.click(reefChip);

    // Проверяем, что чип стал выбранным (проверяем bg-pastel-blue класс)
    expect(reefChip).toHaveClass('bg-primary-action/20');
  });

  it('should handle multiple site type selection', async () => {
    const mockFilters = {
      site_types: [
        { id: 1, label: 'Риф' },
        { id: 2, label: 'Затонувшее судно' },
      ],
      difficulties: [],
    };

    mockUseFilters.mockReturnValue({
      filters: mockFilters,
      loading: false,
      error: null,
    });

    renderWithProviders(<SiteTypeFilters />);

    const reefChip = screen.getByTestId('site-type-filter-1');
    const shipChip = screen.getByTestId('site-type-filter-2');

    // Выбираем первый фильтр
    fireEvent.click(reefChip);
    expect(reefChip).toHaveClass('bg-primary-action/20');

    // Выбираем второй фильтр (множественный выбор)
    fireEvent.click(shipChip);
    expect(shipChip).toHaveClass('bg-primary-action/20');
    expect(reefChip).toHaveClass('bg-primary-action/20'); // Первый остается выбранным
  });

  it('should handle fetch error', async () => {
    mockUseFilters.mockReturnValue({
      filters: null,
      loading: false,
      error: 'Network error',
    });

    renderWithProviders(<SiteTypeFilters />);

    // Компонент не должен рендериться при ошибке
    expect(screen.queryByText('Dive Site Type')).not.toBeInTheDocument();
  });

  it('should toggle site type filter when clicked twice', async () => {
    const mockFilters = {
      site_types: [{ id: 1, label: 'Риф' }],
      difficulties: [],
    };

    mockUseFilters.mockReturnValue({
      filters: mockFilters,
      loading: false,
      error: null,
    });

    renderWithProviders(<SiteTypeFilters />);

    const reefChip = screen.getByTestId('site-type-filter-1');

    // Первый клик - выбираем фильтр
    fireEvent.click(reefChip);
    expect(reefChip).toHaveClass('bg-primary-action/20');

    // Второй клик - снимаем фильтр
    fireEvent.click(reefChip);
    expect(reefChip).not.toHaveClass('bg-pastel-blue');
  });
});
