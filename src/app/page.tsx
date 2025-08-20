'use client';

import Header from '@/components/Header';
import MapContainer from '@/components/map/MapContainer';
import { MapProvider } from '@/contexts/MapContext';
import { PanelProvider } from '@/contexts/PanelContext';
import PanelSwitcher from '@/components/PanelSwitcher';

export default function HomePage() {
  return (
    <main className="h-full w-full flex flex-col min-h-screen bg-background transition-colors">
      <Header />
      <MapProvider>
        <PanelProvider>
          <div className="flex-1 flex min-h-0">
            <MapContainer />
            <PanelSwitcher />
          </div>
        </PanelProvider>
      </MapProvider>
    </main>
  );
}
