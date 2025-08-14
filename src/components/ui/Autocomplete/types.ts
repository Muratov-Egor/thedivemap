// API Response Types
export interface ApiResponse {
  sites: Site[];
  countries: Country[];
  regions: Region[];
  locations: Location[];
  errors: {
    countries: string | null;
    regions: string | null;
    locations: string | null;
  };
}

export interface Site {
  id: number;
  name: string;
  country: {
    name: string;
    region: {
      name: string;
    };
  };
  site_type: {
    label: string;
  };
  site_locations: Array<{
    location: {
      name: string;
    };
  }>;
}

export interface Country {
  id: number;
  name: string;
  iso_code: string;
}

export interface Region {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
  country_id: number;
  region_id: number;
}

// Component Types
export interface AutocompleteProps {
  placeholder?: string;
  className?: string;
  onSelect?: (item: AutocompleteItem) => void;
  onSearch?: (query: string) => void;
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
}

export interface AutocompleteItem {
  id: number;
  name: string;
  type: 'site' | 'country' | 'region' | 'location';
  subtitle?: string;
  metadata?: Record<string, string | number | boolean | string[]>;
}

export interface AutocompleteState {
  query: string;
  results: AutocompleteItem[];
  selectedIndex: number;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UseAutocompleteReturn {
  state: AutocompleteState;
  actions: {
    setQuery: (query: string) => void;
    selectItem: (item: AutocompleteItem) => void;
    openDropdown: () => void;
    closeDropdown: () => void;
    navigateUp: () => void;
    navigateDown: () => void;
    clearResults: () => void;
  };
}

// Utility Types
export type SearchResult = Site | Country | Region | Location;

export interface SearchParams {
  q: string;
  lang?: 'ru' | 'en';
}
