import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageSwitch from '../Header/LanguageSwitch';

// Мокаем react-i18next
const mockChangeLanguage = jest.fn();
const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

// Мокаем localStorage
const mockLocalStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('LanguageSwitch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChangeLanguage.mockClear();
    mockLocalStorage.setItem.mockClear();
  });

  it('рендерит кнопку переключения языка на русском', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        resolvedLanguage: 'ru',
        language: 'ru',
        changeLanguage: mockChangeLanguage,
      },
    });

    render(<LanguageSwitch />);

    const button = screen.getByTestId('language-switch');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('RU');
  });

  it('рендерит кнопку переключения языка на английском', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        resolvedLanguage: 'en',
        language: 'en',
        changeLanguage: mockChangeLanguage,
      },
    });

    render(<LanguageSwitch />);

    const button = screen.getByTestId('language-switch');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('EN');
  });

  it('использует fallback на русский язык', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        resolvedLanguage: null,
        language: null,
        changeLanguage: mockChangeLanguage,
      },
    });

    render(<LanguageSwitch />);

    const button = screen.getByTestId('language-switch');
    expect(button).toHaveTextContent('RU');
  });

  it('переключает язык при клике с русского на английский', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        resolvedLanguage: 'ru',
        language: 'ru',
        changeLanguage: mockChangeLanguage,
      },
    });

    render(<LanguageSwitch />);

    const button = screen.getByTestId('language-switch');
    fireEvent.click(button);

    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('i18nextLng', 'en');
  });

  it('переключает язык при клике с английского на русский', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        resolvedLanguage: 'en',
        language: 'en',
        changeLanguage: mockChangeLanguage,
      },
    });

    render(<LanguageSwitch />);

    const button = screen.getByTestId('language-switch');
    fireEvent.click(button);

    expect(mockChangeLanguage).toHaveBeenCalledWith('ru');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('i18nextLng', 'ru');
  });

  it('обрабатывает ошибки localStorage', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        resolvedLanguage: 'ru',
        language: 'ru',
        changeLanguage: mockChangeLanguage,
      },
    });

    // Симулируем ошибку localStorage
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    render(<LanguageSwitch />);

    const button = screen.getByTestId('language-switch');
    fireEvent.click(button);

    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('i18nextLng', 'en');
    // Компонент не должен падать при ошибке localStorage
  });

  it('обрабатывает частичные языковые коды', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        resolvedLanguage: 'ru-RU',
        language: 'ru-RU',
        changeLanguage: mockChangeLanguage,
      },
    });

    render(<LanguageSwitch />);

    const button = screen.getByTestId('language-switch');
    expect(button).toHaveTextContent('RU');

    fireEvent.click(button);
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('обрабатывает частичные английские коды', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        resolvedLanguage: 'en-US',
        language: 'en-US',
        changeLanguage: mockChangeLanguage,
      },
    });

    render(<LanguageSwitch />);

    const button = screen.getByTestId('language-switch');
    expect(button).toHaveTextContent('EN');

    fireEvent.click(button);
    expect(mockChangeLanguage).toHaveBeenCalledWith('ru');
  });

  it('имеет правильные пропсы кнопки', () => {
    render(<LanguageSwitch />);
    const button = screen.getByTestId('language-switch');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-testid', 'language-switch');
  });
});
