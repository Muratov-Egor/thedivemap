'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useDiveSites } from '@/contexts/DiveSitesContext';
import { useMap } from '@/contexts/MapContext';

export default function MapMarkers() {
  const { map, isLoaded } = useMap();
  const { sites } = useDiveSites();
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Render markers when map is loaded or sites change
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Cleanup previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    for (const site of sites) {
      const { latitude, longitude, name } = site;
      if (
        typeof latitude === 'number' &&
        typeof longitude === 'number' &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      ) {
        const marker = new maplibregl.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(new maplibregl.Popup({ offset: 24 }).setText(name ?? 'Dive site'))
          .addTo(map);
        markersRef.current.push(marker);
      }
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [map, isLoaded, sites]);

  return null;
}
