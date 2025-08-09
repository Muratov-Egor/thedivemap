"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";

export default function MapContainer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "/map-styles/arcgis_hybrid.json",
      center: [98.379111, 7.609361],
      zoom: 14,
      maxZoom: 15,
      hash: false, // disable hash routing
    
      touchZoomRotate: true, // disable touch zoom and rotation
      doubleClickZoom: true, // disable double click zoom
      scrollZoom: true, // disable scroll zoom
      keyboard: true, // disable keyboard shortcuts
      dragPan: true, // disable drag pan
      dragRotate: true, // disable drag rotate
    });

    mapRef.current = map;

    const nav = new maplibregl.NavigationControl({ visualizePitch: true });
    map.addControl(nav, "top-right");

    const scale = new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" });
    map.addControl(scale);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="flex-1 relative">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}