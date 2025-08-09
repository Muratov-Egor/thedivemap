'use client';

import Header from '@/components/Header';
import MapContainer from '@/components/MapContainer';
import Stub from '@/components/stub';
import MapMarkers from '@/components/MapMarkers';

export default function HomePage() {
  return (
    <main className="h-full w-full flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <MapContainer>
          <MapMarkers />
        </MapContainer>
        <Stub />
      </div>
    </main>
  );
}
