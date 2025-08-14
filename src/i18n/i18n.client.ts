'use client';

import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '@/i18n/locales/en/common.json';
import ruCommon from '@/i18n/locales/ru/common.json';
import enFilters from '@/i18n/locales/en/filters.json';
import ruFilters from '@/i18n/locales/ru/filters.json';
import enAutocomplete from '@/i18n/locales/en/autocomplete.json';
import ruAutocomplete from '@/i18n/locales/ru/autocomplete.json';

let i18nSingleton: I18nInstance | null = null;

export function getI18n(): I18nInstance {
  if (i18nSingleton) return i18nSingleton;

  const instance = i18next.createInstance();

  instance
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources: {
        en: { common: enCommon, filters: enFilters, autocomplete: enAutocomplete },
        ru: { common: ruCommon, filters: ruFilters, autocomplete: ruAutocomplete },
      },
      fallbackLng: 'ru',
      supportedLngs: ['en', 'ru'],
      defaultNS: 'common',
      ns: ['common', 'filters', 'autocomplete'],
      interpolation: { escapeValue: false },
      detection: {
        // localStorage to persist user choice; also checks navigator.language
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
      react: {
        useSuspense: false,
      },
    });

  i18nSingleton = instance;
  return instance;
}
