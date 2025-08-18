import { useSliders } from './useSliders';
import { useMap } from '@/contexts/MapContext';
import { AutocompleteItem } from '@/components/ui/Autocomplete/types';

export const useFiltersPanel = () => {
  const { centerOnSelection, activeFilters, clearFilters } = useMap();

  const { depthValue, setDepthValue, visibilityValue, setVisibilityValue, resetSliders } =
    useSliders();

  const handleAutocompleteSelect = async (item: AutocompleteItem) => {
    // Центрируем карту на выбранном элементе
    await centerOnSelection(item);
  };

  const handleClearAll = () => {
    clearFilters();
    resetSliders();
  };

  const hasActiveFilters =
    activeFilters.siteTypeIds.length > 0 ||
    activeFilters.difficultyIds.length > 0 ||
    (activeFilters.maxDepth !== null && activeFilters.maxDepth !== 50) ||
    (activeFilters.minVisibility !== null && activeFilters.minVisibility !== 0) ||
    activeFilters.minRating !== null;

  return {
    // Состояния слайдеров
    depthValue,
    setDepthValue,
    visibilityValue,
    setVisibilityValue,

    // Обработчики
    handleAutocompleteSelect,
    handleClearAll,

    // Состояние фильтров
    hasActiveFilters,
    activeFilters,
  };
};
