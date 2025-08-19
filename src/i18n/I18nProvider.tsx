'use client';

import { I18nextProvider } from 'react-i18next';
import { getI18n } from '@/i18n/i18n.client';
import { useEffect, useState } from 'react';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ready, setReady] = useState(false);
  const i18n = getI18n();

  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.on('initialized', () => setReady(true));
    } else {
      setReady(true);
    }
  }, [i18n]);

  // Возвращаем children даже если i18n не готов, чтобы избежать проблем с гидратацией
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
