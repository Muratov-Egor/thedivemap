import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Полифилл для fetch в тестовой среде
global.fetch = jest.fn();

// Полифилл для Request и Response в тестовой среде
global.Request = class Request {
  constructor(url, options = {}) {
    Object.defineProperty(this, 'url', {
      value: url,
      writable: false,
      enumerable: true,
      configurable: true,
    });
    this.method = options.method || 'GET';
    this.headers = new Map(Object.entries(options.headers || {}));
    this.body = options.body;
  }
};

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.statusText = options.statusText || 'OK';
    this.headers = new Map(Object.entries(options.headers || {}));
  }

  json() {
    return Promise.resolve(typeof this.body === 'string' ? JSON.parse(this.body) : this.body);
  }

  text() {
    return Promise.resolve(typeof this.body === 'string' ? this.body : JSON.stringify(this.body));
  }
};

// Настройка i18n для тестов
i18n.use(initReactI18next).init({
  lng: 'ru',
  fallbackLng: 'ru',
  ns: ['common', 'autocomplete', 'filters'],
  defaultNS: 'common',
  resources: {
    ru: {
      common: {
        'search.placeholder': 'Поиск...',
      },
      autocomplete: {
        'noDiveSites.title': 'Нет дайв-сайтов в {location}',
      },
      filters: {
        title: 'Фильтры',
        siteTypes: {
          title: 'Тип дайв-сайта',
          clearAll: 'Очистить',
          filterBy: 'Фильтровать по',
        },
        difficulties: {
          title: 'Уровень сложности',
          clearAll: 'Очистить',
          filterBy: 'Фильтровать по',
        },
        accessibility: {
          openFilters: 'Открыть фильтры',
          closeFilters: 'Закрыть фильтры',
        },
      },
    },
    en: {
      common: {
        'search.placeholder': 'Search...',
      },
      autocomplete: {
        'noDiveSites.title': 'No dive sites in {location}',
      },
      filters: {
        title: 'Filters',
        siteTypes: {
          title: 'Dive Site Type',
          clearAll: 'Clear',
          filterBy: 'Filter by',
        },
        difficulties: {
          title: 'Difficulty Level',
          clearAll: 'Clear',
          filterBy: 'Filter by',
        },
        accessibility: {
          openFilters: 'Open filters',
          closeFilters: 'Close filters',
        },
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

// Мок для window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Мок для ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
