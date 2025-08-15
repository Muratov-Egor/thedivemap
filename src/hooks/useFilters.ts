import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface FilterOption {
  id: number;
  label: string;
}

export interface FiltersData {
  site_types: FilterOption[];
  difficulties: FilterOption[];
}

export function useFilters() {
  const { i18n } = useTranslation();
  const [filters, setFilters] = useState<FiltersData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentLanguage = i18n.language as 'ru' | 'en';

  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/filters?lang=${currentLanguage}`);
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
  }, [currentLanguage]);

  return {
    filters,
    loading,
    error,
  };
}
