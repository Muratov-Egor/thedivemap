import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматирует координаты в читаемый вид
 * @param lat - широта
 * @param lng - долгота
 * @returns отформатированная строка координат
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latStr = Math.abs(lat).toFixed(4) + (lat >= 0 ? '°N' : '°S');
  const lngStr = Math.abs(lng).toFixed(4) + (lng >= 0 ? '°E' : '°W');
  return `${latStr}, ${lngStr}`;
}

// Re-export flag utilities
export * from './utils/flags';
