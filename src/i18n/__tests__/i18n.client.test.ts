// Мокаем i18next
jest.mock('i18next', () => ({
  createInstance: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockReturnThis(),
  })),
}));

// Мокаем react-i18next
jest.mock('react-i18next', () => ({
  initReactI18next: 'initReactI18next',
}));

// Мокаем i18next-browser-languagedetector
jest.mock('i18next-browser-languagedetector', () => ({
  __esModule: true,
  default: 'LanguageDetector',
}));

// Мокаем JSON файлы локализации
jest.mock('@/i18n/locales/en/common.json', () => ({
  __esModule: true,
  default: { hello: 'Hello' },
}));

jest.mock('@/i18n/locales/ru/common.json', () => ({
  __esModule: true,
  default: { hello: 'Привет' },
}));

jest.mock('@/i18n/locales/en/filters.json', () => ({
  __esModule: true,
  default: { filter: 'Filter' },
}));

jest.mock('@/i18n/locales/ru/filters.json', () => ({
  __esModule: true,
  default: { filter: 'Фильтр' },
}));

jest.mock('@/i18n/locales/en/autocomplete.json', () => ({
  __esModule: true,
  default: { search: 'Search' },
}));

jest.mock('@/i18n/locales/ru/autocomplete.json', () => ({
  __esModule: true,
  default: { search: 'Поиск' },
}));

import { getI18n } from '../i18n.client';

describe('i18n.client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('создает экземпляр i18n', () => {
    const result = getI18n();

    expect(result).toBeDefined();
    expect(typeof result.use).toBe('function');
    expect(typeof result.init).toBe('function');
  });

  it('возвращает экземпляр с правильной структурой', () => {
    const result = getI18n();

    expect(result).toHaveProperty('use');
    expect(result).toHaveProperty('init');
    expect(typeof result.use).toBe('function');
    expect(typeof result.init).toBe('function');
  });

  it('возвращает тот же экземпляр при повторных вызовах', () => {
    const instance1 = getI18n();
    const instance2 = getI18n();

    expect(instance1).toBe(instance2);
  });
});
