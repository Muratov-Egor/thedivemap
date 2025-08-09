'use client';

import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { Button } from './ui/Button';

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
    <Button
      onClick={onToggle}
      className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
      data-testid="lang-switch"
      aria-label="Toggle language"
      size="md"
      variant="secondary"
    >
      {current.startsWith('ru') ? 'RU' : 'EN'}
    </Button>
  );
}
