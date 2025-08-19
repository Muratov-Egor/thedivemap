import { formatCoordinates } from '../utils';

describe('formatCoordinates', () => {
  it('форматирует положительные координаты', () => {
    expect(formatCoordinates(42.1234, 18.5678)).toBe('42.1234°N, 18.5678°E');
  });

  it('форматирует отрицательные координаты', () => {
    expect(formatCoordinates(-42.1234, -18.5678)).toBe('42.1234°S, 18.5678°W');
  });

  it('форматирует смешанные координаты', () => {
    expect(formatCoordinates(42.1234, -18.5678)).toBe('42.1234°N, 18.5678°W');
    expect(formatCoordinates(-42.1234, 18.5678)).toBe('42.1234°S, 18.5678°E');
  });

  it('форматирует нулевые координаты', () => {
    expect(formatCoordinates(0, 0)).toBe('0.0000°N, 0.0000°E');
  });

  it('форматирует координаты с большим количеством знаков после запятой', () => {
    expect(formatCoordinates(42.12345678, 18.56789012)).toBe('42.1235°N, 18.5679°E');
  });
});
