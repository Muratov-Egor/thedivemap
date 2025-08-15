/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCountryFlag } from '../flags';

describe('getCountryFlag', () => {
  it('возвращает правильный флаг для валидного ISO кода', () => {
    expect(getCountryFlag('RU')).toBe('🇷🇺');
    expect(getCountryFlag('US')).toBe('🇺🇸');
    expect(getCountryFlag('FR')).toBe('🇫🇷');
    expect(getCountryFlag('DE')).toBe('🇩🇪');
    expect(getCountryFlag('IT')).toBe('🇮🇹');
    expect(getCountryFlag('ES')).toBe('🇪🇸');
    expect(getCountryFlag('GB')).toBe('🇬🇧');
    expect(getCountryFlag('CN')).toBe('🇨🇳');
    expect(getCountryFlag('JP')).toBe('🇯🇵');
    expect(getCountryFlag('KR')).toBe('🇰🇷');
  });

  it('работает с нижним регистром', () => {
    expect(getCountryFlag('ru')).toBe('🇷🇺');
    expect(getCountryFlag('us')).toBe('🇺🇸');
    expect(getCountryFlag('fr')).toBe('🇫🇷');
  });

  it('возвращает 🌍 для пустой строки', () => {
    expect(getCountryFlag('')).toBe('🌍');
  });

  it('возвращает 🌍 для null', () => {
    expect(getCountryFlag(null as any)).toBe('🌍');
  });

  it('возвращает 🌍 для undefined', () => {
    expect(getCountryFlag(undefined as any)).toBe('🌍');
  });

  it('возвращает 🌍 для строки длиной 1', () => {
    expect(getCountryFlag('R')).toBe('🌍');
  });

  it('возвращает 🌍 для строки длиной 3', () => {
    expect(getCountryFlag('RUS')).toBe('🌍');
  });

  it('возвращает 🌍 для строки длиной 0', () => {
    expect(getCountryFlag('')).toBe('🌍');
  });

  it('работает с различными валидными кодами', () => {
    const testCases = [
      { code: 'AU', expected: '🇦🇺' },
      { code: 'CA', expected: '🇨🇦' },
      { code: 'BR', expected: '🇧🇷' },
      { code: 'AR', expected: '🇦🇷' },
      { code: 'MX', expected: '🇲🇽' },
      { code: 'IN', expected: '🇮🇳' },
      { code: 'ZA', expected: '🇿🇦' },
      { code: 'EG', expected: '🇪🇬' },
      { code: 'NG', expected: '🇳🇬' },
      { code: 'KE', expected: '🇰🇪' },
    ];

    testCases.forEach(({ code, expected }) => {
      expect(getCountryFlag(code)).toBe(expected);
    });
  });

  it('правильно конвертирует ASCII коды в emoji', () => {
    // Проверяем что функция правильно использует формулу charCodeAt(0) + 127397
    const code = 'AB';
    const result = getCountryFlag(code);

    // A (65) + 127397 = 127462 (🇦)
    // B (66) + 127397 = 127463 (🇧)
    // Результат должен быть 🇦🇧
    expect(result).toBe('🇦🇧');
  });
});
