import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Dive Map',
  description: 'Мировая карта дайв-сайтов',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
