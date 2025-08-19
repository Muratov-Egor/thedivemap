import { useState, useCallback } from 'react';
import { DiveSiteDetails } from '@/lib/types/supabase';

interface UseDiveSiteDetailsReturn {
  diveSite: DiveSiteDetails | null;
  error: string | null;
  fetchDiveSiteDetails: (id: string) => Promise<void>;
  clearDiveSite: () => void;
}

export function useDiveSiteDetails(): UseDiveSiteDetailsReturn {
  const [diveSite, setDiveSite] = useState<DiveSiteDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDiveSiteDetails = useCallback(async (id: string) => {
    if (!id) {
      setError('Site ID is required');
      return;
    }

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
    }
  }, []);

  const clearDiveSite = useCallback(() => {
    setDiveSite(null);
    setError(null);
  }, []);

  return {
    diveSite,
    error,
    fetchDiveSiteDetails,
    clearDiveSite,
  };
}
