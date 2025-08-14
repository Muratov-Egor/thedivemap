/**
 * Конвертирует ISO код страны в emoji флаг
 * @param isoCode - ISO код страны (например, "RU", "US", "FR")
 * @returns emoji флаг страны или 🌍 если код невалидный
 * 
 * @example
 * getCountryFlag("RU") // 🇷🇺
 * getCountryFlag("US") // 🇺🇸
 * getCountryFlag("FR") // 🇫🇷
 * getCountryFlag("") // 🌍
 */
export const getCountryFlag = (isoCode: string): string => {
  if (!isoCode || isoCode.length !== 2) return '🌍';
  
  // Конвертируем ISO код в emoji флаг
  // Каждая буква конвертируется в региональный индикатор
  // 127397 = 0x1F1E6 (🇦) - 65 (A)
  const codePoints = isoCode
    .toUpperCase()
    .split('')
    .map(char => char.charCodeAt(0) + 127397);
  
  return String.fromCodePoint(...codePoints);
};
