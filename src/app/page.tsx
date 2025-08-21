'use client';

import { Suspense } from 'react';
import Header from '@/components/Header/Header';
import MapContainer from '@/components/map/MapContainer';
import { MapProvider } from '@/contexts/MapContext';
import { PanelProvider } from '@/contexts/PanelContext';
import PanelSwitcher from '@/components/PanelSwitcher';

function MapContent() {
  return (
    <MapProvider>
      <PanelProvider>
        <div className="flex-1 flex min-h-0">
          <MapContainer />
          <PanelSwitcher />
        </div>
      </PanelProvider>
    </MapProvider>
  );
}

export default function HomePage() {
  return (
    <main className="h-full w-full flex flex-col min-h-screen bg-background transition-colors">
      <Header />
      <Suspense
        fallback={<div className="flex-1 flex items-center justify-center">Загрузка карты...</div>}
      >
        <MapContent />
      </Suspense>
    </main>
  );
}
