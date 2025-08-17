'use client';

import Header from '@/components/Header';
import MapContainer from '@/components/map/MapContainer';
import Filters from '@/components/FiltersPanel/Filters';
import { MapProvider } from '@/contexts/MapContext';

export default function HomePage() {
  return (
    <main className="h-full w-full flex flex-col">
      <Header />
      <MapProvider>
        <div className="flex-1 flex">
          <MapContainer />
          <Filters />
        </div>
      </MapProvider>
    </main>
  );
}
