import type { Metadata } from 'next';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import I18nProvider from '../i18n/I18nProvider';
import LangAttribute from '../i18n/LangAttribute';
import { DiveSitesProvider } from '@/contexts/DiveSitesContext';

export const metadata: Metadata = {
  title: 'The Dive Map',
  description: 'Мировая карта дайв-сайтов',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <I18nProvider>
          <LangAttribute />
          <DiveSitesProvider>{children}</DiveSitesProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
