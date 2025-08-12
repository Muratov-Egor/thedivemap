'use client';

import Header from '@/components/Header';
import MapContainer from '@/components/MapContainer';
import Stub from '@/components/stub';

export default function HomePage() {
  return (
    <main className="h-full w-full flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <MapContainer />
        <Stub />
      </div>
    </main>
  );
}
