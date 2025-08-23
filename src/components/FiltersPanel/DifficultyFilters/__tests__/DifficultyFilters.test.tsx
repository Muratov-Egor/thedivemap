import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { getI18n } from '@/i18n/i18n.client';
import DifficultyFilters from '../DifficultyFilters';
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

describe('DifficultyFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    mockUseFilters.mockReturnValue({
      filters: null,
      loading: true,
      error: null,
    });

    renderWithProviders(<DifficultyFilters />);

    // Компонент не должен рендериться во время загрузки
    expect(screen.queryByText('Difficulty Level')).not.toBeInTheDocument();
  });

  it('should render difficulties after loading', async () => {
    const mockFilters = {
      site_types: [],
      difficulties: [
        { id: 1, label: 'Легкий' },
        { id: 2, label: 'Средний' },
      ],
    };

    mockUseFilters.mockReturnValue({
      filters: mockFilters,
      loading: false,
      error: null,
    });

    renderWithProviders(<DifficultyFilters />);

    expect(screen.getByText('Легкий')).toBeInTheDocument();
    expect(screen.getByText('Средний')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty-filter-1')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty-filter-2')).toBeInTheDocument();
  });

  it('should handle difficulty selection', async () => {
    const mockFilters = {
      site_types: [],
      difficulties: [
        { id: 1, label: 'Легкий' },
        { id: 2, label: 'Средний' },
      ],
    };

    mockUseFilters.mockReturnValue({
      filters: mockFilters,
      loading: false,
      error: null,
    });

    renderWithProviders(<DifficultyFilters />);

    const easyChip = screen.getByTestId('difficulty-filter-1');
    fireEvent.click(easyChip);

    // Проверяем, что чип стал выбранным (проверяем bg-pastel-yellow класс)
    expect(easyChip).toHaveClass('bg-pastel-yellow');
  });

  it('should handle multiple difficulty selection', async () => {
    const mockFilters = {
      site_types: [],
      difficulties: [
        { id: 1, label: 'Легкий' },
        { id: 2, label: 'Средний' },
      ],
    };

    mockUseFilters.mockReturnValue({
      filters: mockFilters,
      loading: false,
      error: null,
    });

    renderWithProviders(<DifficultyFilters />);

    const easyChip = screen.getByTestId('difficulty-filter-1');
    const mediumChip = screen.getByTestId('difficulty-filter-2');

    // Выбираем первый фильтр
    fireEvent.click(easyChip);
    expect(easyChip).toHaveClass('bg-pastel-yellow');

    // Выбираем второй фильтр (множественный выбор)
    fireEvent.click(mediumChip);
    expect(mediumChip).toHaveClass('bg-pastel-yellow');
    expect(easyChip).toHaveClass('bg-pastel-yellow'); // Первый остается выбранным
  });

  it('should handle fetch error', async () => {
    mockUseFilters.mockReturnValue({
      filters: null,
      loading: false,
      error: 'Network error',
    });

    renderWithProviders(<DifficultyFilters />);

    // Компонент не должен рендериться при ошибке
    expect(screen.queryByText('Difficulty Level')).not.toBeInTheDocument();
  });

  it('should toggle difficulty filter when clicked twice', async () => {
    const mockFilters = {
      site_types: [],
      difficulties: [{ id: 1, label: 'Легкий' }],
    };

    mockUseFilters.mockReturnValue({
      filters: mockFilters,
      loading: false,
      error: null,
    });

    renderWithProviders(<DifficultyFilters />);

    const easyChip = screen.getByTestId('difficulty-filter-1');

    // Первый клик - выбираем фильтр
    fireEvent.click(easyChip);
    expect(easyChip).toHaveClass('bg-pastel-yellow');

    // Второй клик - снимаем фильтр
    fireEvent.click(easyChip);
    expect(easyChip).not.toHaveClass('bg-pastel-yellow');
  });
});
