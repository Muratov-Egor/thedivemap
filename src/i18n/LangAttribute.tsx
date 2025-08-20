'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LangAttribute() {
  const { i18n } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const html = document.documentElement;
    const update = () => {
      const lang = i18n.resolvedLanguage || i18n.language || 'ru';
      html.setAttribute('lang', lang);
    };
    update();
    i18n.on('languageChanged', update);
    return () => {
      i18n.off('languageChanged', update);
    };
  }, [i18n, isMounted]);

  return null;
}
