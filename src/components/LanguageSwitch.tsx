'use client';

import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';

export default function LanguageSwitch() {
  const { i18n } = useTranslation();

  const current = i18n.resolvedLanguage || i18n.language || 'ru';
  const nextLang = useMemo(() => (current.startsWith('ru') ? 'en' : 'ru'), [current]);

  const onToggle = useCallback(() => {
    i18n.changeLanguage(nextLang);
    try {
      window?.localStorage?.setItem('i18nextLng', nextLang);
    } catch {}
  }, [i18n, nextLang]);

  return (
    <button onClick={onToggle} className="px-2 py-1 text-sm border rounded hover:bg-gray-50">
      {current.startsWith('ru') ? 'RU' : 'EN'}
    </button>
  );
}
