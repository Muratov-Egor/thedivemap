import { describe, it, expect } from 'vitest';
import { validateSiteData, validateCoordinates, validateRating, createTestSite } from '../setup';

describe('Data Validation', () => {
  it('должен валидировать координаты', () => {
    expect(validateCoordinates(12.3456, 78.9012)).toBe(true);
    expect(validateCoordinates(0, 0)).toBe(true); // Широта > 90
    expect(validateCoordinates(0, 181)).toBe(false); // Долгота > 180
    expect(validateCoordinates(91, 0)).toBe(false); // Широта > 90
    expect(validateCoordinates(0, -181)).toBe(false); // Долгота < -180
  });

  it('должен валидировать рейтинг', () => {
    expect(validateRating(0)).toBe(true);
    expect(validateRating(5)).toBe(true);
    expect(validateRating(-1)).toBe(false);
    expect(validateRating(6)).toBe(false);
    expect(validateRating(3.5)).toBe(true);
  });

  it('должен валидировать данные сайта', () => {
    const validSite = createTestSite();
    expect(validateSiteData(validSite)).toBe(true);
  });

  it('должен отклонять невалидные данные сайта', () => {
    const invalidSite = {
      ...createTestSite(),
      id: 123, // должно быть string
      latitude: 'invalid', // должно быть number
    };
    expect(validateSiteData(invalidSite)).toBe(false);
  });
});
