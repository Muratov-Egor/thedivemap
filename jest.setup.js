import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
        // Пустые переводы для тестов
      },
      autocomplete: {
        // Пустые переводы для тестов
      },
      filters: {
        // Пустые переводы для тестов
      },
    },
    en: {
      common: {
        // Пустые переводы для тестов
      },
      autocomplete: {
        // Пустые переводы для тестов
      },
      filters: {
        // Пустые переводы для тестов
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
