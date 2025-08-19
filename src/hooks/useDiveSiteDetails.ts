import { useState, useCallback } from 'react';
import { DiveSiteDetails } from '@/lib/types/supabase';

interface UseDiveSiteDetailsReturn {
  diveSite: DiveSiteDetails | null;
  loading: boolean;
  error: string | null;
  fetchDiveSiteDetails: (id: string) => Promise<void>;
  clearDiveSite: () => void;
}

export function useDiveSiteDetails(): UseDiveSiteDetailsReturn {
  const [diveSite, setDiveSite] = useState<DiveSiteDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiveSiteDetails = useCallback(async (id: string) => {
    if (!id) {
      setError('Site ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dive-sites/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dive site details');
      }

      const data: DiveSiteDetails = await response.json();
      setDiveSite(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setDiveSite(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearDiveSite = useCallback(() => {
    setDiveSite(null);
    setError(null);
  }, []);

  return {
    diveSite,
    loading,
    error,
    fetchDiveSiteDetails,
    clearDiveSite,
  };
}
