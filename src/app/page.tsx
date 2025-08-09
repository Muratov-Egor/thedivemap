'use client';

import Header from '@/components/Header';
import MapContainer from '@/components/MapContainer';
import Stub from '@/components/stub';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation('common');
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
