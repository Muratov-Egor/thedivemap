import type { Metadata } from 'next';
import I18nProvider from '@/i18n/I18nProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import LangAttribute from '../i18n/LangAttribute';
import { FiltersProvider } from '../contexts/FiltersContext';

export const metadata: Metadata = {
  title: 'The Dive Map',
  description: 'Карта дайв-сайтов мира',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <ThemeProvider>
            <AuthProvider>
              <FiltersProvider>
                <LangAttribute />
                {children}
              </FiltersProvider>
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
