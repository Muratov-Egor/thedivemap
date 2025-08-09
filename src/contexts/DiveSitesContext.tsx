'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { DiveSitesFilters, Site } from '@/types/database';

interface DiveSitesState {
  sites: Site[];
  loading: boolean;
  error: string | null;
  filters: DiveSitesFilters;
}

interface DiveSitesActions {
  setFilters: (
    update: Partial<DiveSitesFilters> | ((prev: DiveSitesFilters) => Partial<DiveSitesFilters>),
  ) => void;
  resetFilters: () => void;
  refetch: () => void;
}

const DiveSitesContext = createContext<(DiveSitesState & DiveSitesActions) | undefined>(undefined);

function buildQueryString(filters: DiveSitesFilters): string {
  const params = new URLSearchParams();
  (Object.entries(filters) as Array<[keyof DiveSitesFilters, unknown]>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(String(key), String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function DiveSitesProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<DiveSitesFilters>({});

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);

  const fetchSites = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const query = buildQueryString(filters);
      const response = await fetch(`/api/dive-sites${query}`, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const json: unknown = await response.json();
      if (!Array.isArray(json)) {
        throw new Error('Invalid response shape');
      }
      if (currentRequestId !== requestIdRef.current) return; // stale response
      setSites(json as Site[]);
    } catch (err) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      setError((err as Error).message ?? 'Failed to load dive sites');
      setSites([]);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    void fetchSites();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchSites]);

  const setFilters: DiveSitesActions['setFilters'] = useCallback((update) => {
    setFiltersState((prev) => ({
      ...prev,
      ...(typeof update === 'function' ? update(prev) : update),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  const refetch = useCallback(() => {
    void fetchSites();
  }, [fetchSites]);

  const value = useMemo(
    () => ({ sites, loading, error, filters, setFilters, resetFilters, refetch }),
    [sites, loading, error, filters, setFilters, resetFilters, refetch],
  );

  return <DiveSitesContext.Provider value={value}>{children}</DiveSitesContext.Provider>;
}

export function useDiveSites(): DiveSitesState & DiveSitesActions {
  const ctx = useContext(DiveSitesContext);
  if (!ctx) throw new Error('useDiveSites must be used within DiveSitesProvider');
  return ctx;
}
