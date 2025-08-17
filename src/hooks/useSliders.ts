import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { useMap } from '@/contexts/MapContext';

export const useSliders = () => {
  // Состояния для слайдеров
  const [depthValue, setDepthValue] = useState(50);
  const [visibilityValue, setVisibilityValue] = useState(0);

  // Debounce для предотвращения спама запросов
  const debouncedDepthValue = useDebounce(depthValue, 500);
  const debouncedVisibilityValue = useDebounce(visibilityValue, 500);

  const { activeFilters, setMaxDepthFilter, setMinVisibilityFilter } = useMap();

  // Применяем debounced значения к фильтрам только если они отличаются от дефолтных
  useEffect(() => {
    if (debouncedDepthValue !== 50) {
      setMaxDepthFilter(debouncedDepthValue);
    } else {
      setMaxDepthFilter(null);
    }
  }, [debouncedDepthValue, setMaxDepthFilter]);

  useEffect(() => {
    if (debouncedVisibilityValue !== 0) {
      setMinVisibilityFilter(debouncedVisibilityValue);
    } else {
      setMinVisibilityFilter(null);
    }
  }, [debouncedVisibilityValue, setMinVisibilityFilter]);

  // Синхронизируем локальные состояния с активными фильтрами
  useEffect(() => {
    if (activeFilters.maxDepth === null) {
      setDepthValue(50); // Значение по умолчанию
    }
  }, [activeFilters.maxDepth]);

  useEffect(() => {
    if (activeFilters.minVisibility === null) {
      setVisibilityValue(0); // Значение по умолчанию
    }
  }, [activeFilters.minVisibility]);

  const resetSliders = () => {
    setDepthValue(50);
    setVisibilityValue(0);
    setMaxDepthFilter(null);
    setMinVisibilityFilter(null);
  };

  return {
    depthValue,
    setDepthValue,
    visibilityValue,
    setVisibilityValue,
    resetSliders,
  };
};
