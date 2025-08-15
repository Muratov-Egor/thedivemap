import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LangAttribute from '../LangAttribute';

// Мокаем react-i18next
const mockI18n = {
  resolvedLanguage: 'ru',
  language: 'ru',
  on: jest.fn(),
  off: jest.fn(),
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: mockI18n,
  }),
}));

describe('LangAttribute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Сбрасываем атрибут lang
    document.documentElement.removeAttribute('lang');
  });

  it('устанавливает атрибут lang при монтировании', () => {
    render(<LangAttribute />);

    expect(document.documentElement).toHaveAttribute('lang', 'ru');
  });

  it('использует resolvedLanguage если доступен', () => {
    mockI18n.resolvedLanguage = 'en';
    mockI18n.language = 'ru';

    render(<LangAttribute />);

    expect(document.documentElement).toHaveAttribute('lang', 'en');
  });

  it('использует language если resolvedLanguage недоступен', () => {
    mockI18n.resolvedLanguage = null;
    mockI18n.language = 'en';

    render(<LangAttribute />);

    expect(document.documentElement).toHaveAttribute('lang', 'en');
  });

  it('использует fallback язык если ни один не доступен', () => {
    mockI18n.resolvedLanguage = null;
    mockI18n.language = null;

    render(<LangAttribute />);

    expect(document.documentElement).toHaveAttribute('lang', 'ru');
  });

  it('подписывается на событие languageChanged', () => {
    render(<LangAttribute />);

    expect(mockI18n.on).toHaveBeenCalledWith('languageChanged', expect.any(Function));
  });

  it('отписывается от события languageChanged при размонтировании', () => {
    const { unmount } = render(<LangAttribute />);

    unmount();

    expect(mockI18n.off).toHaveBeenCalledWith('languageChanged', expect.any(Function));
  });

  it('обновляет атрибут lang при смене языка', () => {
    render(<LangAttribute />);

    // Получаем callback функцию
    const languageChangedCallback = mockI18n.on.mock.calls[0][1];

    // Симулируем смену языка
    mockI18n.resolvedLanguage = 'en';
    languageChangedCallback();

    expect(document.documentElement).toHaveAttribute('lang', 'en');
  });

  it('не рендерит никакого DOM элемента', () => {
    const { container } = render(<LangAttribute />);

    expect(container.firstChild).toBeNull();
  });

  it('обрабатывает множественные вызовы update', () => {
    render(<LangAttribute />);

    // Получаем callback функцию
    const languageChangedCallback = mockI18n.on.mock.calls[0][1];

    // Симулируем несколько смен языка
    mockI18n.resolvedLanguage = 'en';
    languageChangedCallback();

    mockI18n.resolvedLanguage = 'ru';
    languageChangedCallback();

    expect(document.documentElement).toHaveAttribute('lang', 'ru');
  });

  it('сохраняет существующий атрибут lang если он уже установлен', () => {
    document.documentElement.setAttribute('lang', 'fr');

    render(<LangAttribute />);

    expect(document.documentElement).toHaveAttribute('lang', 'ru');
  });
});
