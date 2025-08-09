'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Map } from 'maplibre-gl';

interface MapContextValue {
  map: Map | null;
  isLoaded: boolean;
  setMap: (map: Map | null) => void;
  setLoaded: (loaded: boolean) => void;
}

const MapContext = createContext<MapContextValue | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<Map | null>(null);
  const [isLoaded, setLoaded] = useState(false);

  const value = useMemo(() => ({ map, isLoaded, setMap, setLoaded }), [map, isLoaded]);
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMap must be used within MapProvider');
  return ctx;
}
