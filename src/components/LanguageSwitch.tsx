'use client';

import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import Button from '@/components/ui/Button';

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
    <Button onClick={onToggle} variant="secondary" size="small" data-testid="language-switch">
      {current.startsWith('ru') ? 'RU' : 'EN'}
    </Button>
  );
}
