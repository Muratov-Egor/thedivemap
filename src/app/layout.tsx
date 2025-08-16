import type { Metadata } from 'next';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import I18nProvider from '../i18n/I18nProvider';
import LangAttribute from '../i18n/LangAttribute';
import { FiltersProvider } from '../contexts/FiltersContext';

export const metadata: Metadata = {
  title: 'The Dive Map',
  description: 'Мировая карта дайв-сайтов',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <I18nProvider>
          <FiltersProvider>
            <LangAttribute />
            {children}
          </FiltersProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
