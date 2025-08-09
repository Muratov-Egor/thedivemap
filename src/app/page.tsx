'use client';

import Header from '@/components/Header';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation('common');
  return (
    <main className="h-screen w-full flex flex-col">
      <Header />
      <div className="flex-1 ">
        <h1 className="text-3xl font-bold">{t('home.title')}</h1>
      </div>
    </main>
  );
}
