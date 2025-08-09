'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import { MapProvider, useMap } from '@/contexts/MapContext';

function InnerMapContainer({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const { setMap, setLoaded } = useMap();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: '/map-styles/arcgis_hybrid.json',
      center: [98.379111, 7.609361],
      zoom: 14,
      maxZoom: 15,
      hash: false,
      touchZoomRotate: true,
      doubleClickZoom: true,
      scrollZoom: true,
      keyboard: true,
      dragPan: true,
      dragRotate: true,
    });

    mapRef.current = map;
    setMap(map);

    const nav = new maplibregl.NavigationControl({ visualizePitch: true });
    map.addControl(nav, 'top-right');

    const scale = new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' });
    map.addControl(scale);

    const onLoad = () => setLoaded(true);
    map.on('load', onLoad);

    return () => {
      map.off('load', onLoad);
      setLoaded(false);
      setMap(null);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [setLoaded, setMap]);

  return (
    <div className="flex-1 relative">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      {children}
    </div>
  );
}

export default function MapContainer({ children }: { children?: React.ReactNode }) {
  return (
    <MapProvider>
      <InnerMapContainer>{children}</InnerMapContainer>
    </MapProvider>
  );
}
