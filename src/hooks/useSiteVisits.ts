import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface SiteVisit {
  id: string;
  site_id: string;
  visited_at: string;
  sites?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
}

interface UseSiteVisitsReturn {
  visits: SiteVisit[];
  loading: boolean;
  error: string | null;
  markAsVisited: (siteId: string, onSuccess?: () => void) => Promise<boolean>;
  removeVisit: (siteId: string, onSuccess?: () => void) => Promise<boolean>;
  fetchVisits: () => Promise<void>;
  clearError: () => void;
}

export function useSiteVisits(): UseSiteVisitsReturn {
  const { user } = useAuth();
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchVisits = useCallback(async () => {
    if (!user) {
      setVisits([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/site-visits');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch visits');
      }

      const data = await response.json();
      setVisits(data.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsVisited = useCallback(
    async (siteId: string, onSuccess?: () => void): Promise<boolean> => {
      if (!user) {
        setError('User must be authenticated to mark sites as visited');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/site-visits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ site_id: siteId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to mark site as visited');
        }

        // Обновляем список посещений
        await fetchVisits();

        // Вызываем callback для обновления данных дайв-сайта
        if (onSuccess) {
          onSuccess();
        }

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user, fetchVisits],
  );

  const removeVisit = useCallback(
    async (siteId: string, onSuccess?: () => void): Promise<boolean> => {
      if (!user) {
        setError('User must be authenticated to remove visit marks');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/site-visits?site_id=${siteId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to remove visit mark');
        }

        // Обновляем список посещений
        await fetchVisits();

        // Вызываем callback для обновления данных дайв-сайта
        if (onSuccess) {
          onSuccess();
        }

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user, fetchVisits],
  );

  return {
    visits,
    loading,
    error,
    markAsVisited,
    removeVisit,
    fetchVisits,
    clearError,
  };
}
