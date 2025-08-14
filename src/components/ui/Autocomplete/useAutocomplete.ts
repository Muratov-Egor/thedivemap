'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AutocompleteItem, AutocompleteState, UseAutocompleteReturn, Site, Country, Region, Location } from './types';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 10;

export function useAutocomplete(
  onSelect?: (item: AutocompleteItem) => void,
  debounceMs: number = DEBOUNCE_MS,
  minQueryLength: number = MIN_QUERY_LENGTH,
  maxResults: number = MAX_RESULTS
): UseAutocompleteReturn {
  const [state, setState] = useState<AutocompleteState>({
    query: '',
    results: [],
    selectedIndex: -1,
    isOpen: false,
    isLoading: false,
    error: null,
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (query.length < minQueryLength) {
      setState(prev => ({
        ...prev,
        results: [],
        isOpen: false,
        isLoading: false,
        error: null,
      }));
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const searchParams = new URLSearchParams({
        q: query,
        lang: 'ru', // Default to Russian, can be made configurable
      });

      const response = await fetch(`/api/places/?${searchParams}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform API response to AutocompleteItem format
      const results: AutocompleteItem[] = [];

      // Add sites
      if (data.sites) {
        data.sites.forEach((site: Site) => {
          results.push({
            id: site.id,
            name: site.name,
            type: 'site',
            subtitle: `${site.country?.name || ''} ${site.country?.region?.name || ''}`.trim(),
            metadata: {
              site_type: site.site_type?.label,
              locations: site.site_locations.map(loc => loc.location.name),
            },
          });
        });
      }

      // Add countries
      if (data.countries) {
        data.countries.forEach((country: Country) => {
          results.push({
            id: country.id,
            name: country.name,
            type: 'country',
            subtitle: country.iso_code,
            metadata: { iso_code: country.iso_code },
          });
        });
      }

      // Add regions
      if (data.regions) {
        data.regions.forEach((region: Region) => {
          results.push({
            id: region.id,
            name: region.name,
            type: 'region',
            subtitle: 'Регион',
            metadata: {},
          });
        });
      }

      // Add locations
      if (data.locations) {
        data.locations.forEach((location: Location) => {
          results.push({
            id: location.id,
            name: location.name,
            type: 'location',
            subtitle: 'Локация',
            metadata: {
              country_id: location.country_id,
              region_id: location.region_id,
            },
          });
        });
      }

      // Limit results and update state
      const limitedResults = results.slice(0, maxResults);

      setState(prev => ({
        ...prev,
        results: limitedResults,
        isOpen: limitedResults.length > 0,
        isLoading: false,
        selectedIndex: limitedResults.length > 0 ? 0 : -1,
      }));

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Search failed',
        isOpen: false,
      }));
    }
  }, [minQueryLength, maxResults]);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (state.query.length >= minQueryLength) {
      debounceRef.current = setTimeout(() => {
        performSearch(state.query);
      }, debounceMs);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [state.query, debounceMs, minQueryLength, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const actions = {
    setQuery: useCallback((query: string) => {
      setState(prev => ({
        ...prev,
        query,
        selectedIndex: -1,
      }));
    }, []),

    selectItem: useCallback((item: AutocompleteItem) => {
      setState(prev => ({
        ...prev,
        query: item.name,
        isOpen: false,
        selectedIndex: -1,
      }));
      onSelect?.(item);
    }, [onSelect]),

    openDropdown: useCallback(() => {
      if (state.results.length > 0) {
        setState(prev => ({
          ...prev,
          isOpen: true,
        }));
      }
    }, [state.results.length]),

    closeDropdown: useCallback(() => {
      setState(prev => ({
        ...prev,
        isOpen: false,
        selectedIndex: -1,
      }));
    }, []),

    navigateUp: useCallback(() => {
      setState(prev => ({
        ...prev,
        selectedIndex: prev.selectedIndex > 0 ? prev.selectedIndex - 1 : prev.results.length - 1,
      }));
    }, []),

    navigateDown: useCallback(() => {
      setState(prev => ({
        ...prev,
        selectedIndex: prev.selectedIndex < prev.results.length - 1 ? prev.selectedIndex + 1 : 0,
      }));
    }, []),

    clearResults: useCallback(() => {
      setState(prev => ({
        ...prev,
        results: [],
        isOpen: false,
        selectedIndex: -1,
        error: null,
      }));
    }, []),
  };

  return { state, actions };
}
