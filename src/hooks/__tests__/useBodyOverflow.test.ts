import { renderHook } from '@testing-library/react';
import { useBodyOverflow } from '../useBodyOverflow';

describe('useBodyOverflow', () => {
  let originalOverflow: string;
  let originalOverflowX: string;

  beforeEach(() => {
    // Сохраняем оригинальные значения
    originalOverflow = document.body.style.overflow;
    originalOverflowX = document.body.style.overflowX;

    // Очищаем стили
    document.body.style.overflow = '';
    document.body.style.overflowX = '';
  });

  afterEach(() => {
    // Восстанавливаем оригинальные значения
    document.body.style.overflow = originalOverflow;
    document.body.style.overflowX = originalOverflowX;
  });

  it('блокирует горизонтальный скролл при открытии', () => {
    renderHook(() => useBodyOverflow(true));

    expect(document.body.style.overflowX).toBe('hidden');
  });

  it('восстанавливает состояние при закрытии', () => {
    // Устанавливаем начальное состояние
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'auto';

    const { unmount } = renderHook(() => useBodyOverflow(true));

    expect(document.body.style.overflowX).toBe('hidden');

    unmount();

    expect(document.body.style.overflowX).toBe('auto');
    expect(document.body.style.overflow).toBe('auto');
  });

  it('не изменяет overflow если панель закрыта', () => {
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'auto';

    renderHook(() => useBodyOverflow(false));

    expect(document.body.style.overflowX).toBe('auto');
    expect(document.body.style.overflow).toBe('auto');
  });

  it('сохраняет вертикальный скролл при блокировке горизонтального', () => {
    document.body.style.overflow = 'auto';

    renderHook(() => useBodyOverflow(true));

    expect(document.body.style.overflowX).toBe('hidden');
    expect(document.body.style.overflow).toBe('auto');
  });

  it('работает с пустыми значениями overflow', () => {
    renderHook(() => useBodyOverflow(true));

    expect(document.body.style.overflowX).toBe('hidden');
  });
});
