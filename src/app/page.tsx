'use client';

import Header from '@/components/Header';
import MapContainer from '@/components/map/MapContainer';
import { MapProvider } from '@/contexts/MapContext';
import { PanelProvider } from '@/contexts/PanelContext';
import PanelSwitcher from '@/components/PanelSwitcher';

export default function HomePage() {
  return (
    <main className="h-full w-full flex flex-col">
      <Header />
      <MapProvider>
        <PanelProvider>
          <div className="flex-1 flex">
            <MapContainer />
            <PanelSwitcher />
          </div>
        </PanelProvider>
      </MapProvider>
    </main>
  );
}
