'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';

export interface FilterOption {
  id: number;
  labels: {
    ru: string;
    en: string;
  };
}

export interface FiltersData {
  site_types: FilterOption[];
  difficulties: FilterOption[];
}

interface FiltersContextType {
  filters: {
    site_types: { id: number; label: string }[];
    difficulties: { id: number; label: string }[];
  } | null;
  loading: boolean;
  error: string | null;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [filters, setFilters] = useState<FiltersData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const currentLanguage = i18n.language as 'ru' | 'en';

  useEffect(() => {
    const fetchFilters = async () => {
      // Загружаем фильтры только один раз
      if (hasFetched.current) return;

      hasFetched.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/filters');
        if (!response.ok) {
          throw new Error('Failed to fetch filters');
        }

        const data = await response.json();
        setFilters(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching filters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Получаем локализованные фильтры на основе текущего языка
  const localizedFilters = useMemo(() => {
    if (!filters) return null;

    return {
      site_types: filters.site_types.map((type) => ({
        id: type.id,
        label: type.labels?.[currentLanguage] || type.labels?.ru || '',
      })),
      difficulties: filters.difficulties.map((difficulty) => ({
        id: difficulty.id,
        label: difficulty.labels?.[currentLanguage] || difficulty.labels?.ru || '',
      })),
    };
  }, [filters, currentLanguage]);

  const value = {
    filters: localizedFilters,
    loading,
    error,
  };

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}
