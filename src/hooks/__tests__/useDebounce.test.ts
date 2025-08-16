import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('возвращает начальное значение сразу', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('обновляет значение после задержки', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    // Изменяем значение
    rerender({ value: 'updated', delay: 500 });

    // Значение еще не изменилось
    expect(result.current).toBe('initial');

    // Проходим задержку
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Теперь значение обновилось
    expect(result.current).toBe('updated');
  });

  it('отменяет предыдущий таймер при новом значении', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // Изменяем значение первый раз
    rerender({ value: 'first', delay: 500 });

    // Проходим половину задержки
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current).toBe('initial');

    // Изменяем значение второй раз
    rerender({ value: 'second', delay: 500 });

    // Проходим полную задержку с момента последнего изменения
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Значение должно быть 'second', а не 'first'
    expect(result.current).toBe('second');
  });

  it('работает с числами', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 0, delay: 300 },
    });

    expect(result.current).toBe(0);

    rerender({ value: 42, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  it('работает с объектами', () => {
    const initialObj = { name: 'John', age: 25 };
    const updatedObj = { name: 'Jane', age: 30 };

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: initialObj, delay: 200 },
    });

    expect(result.current).toEqual(initialObj);

    rerender({ value: updatedObj, delay: 200 });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toEqual(updatedObj);
  });

  it('работает с массивами', () => {
    const initialArray = [1, 2, 3];
    const updatedArray = [4, 5, 6];

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: initialArray, delay: 100 },
    });

    expect(result.current).toEqual(initialArray);

    rerender({ value: updatedArray, delay: 100 });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toEqual(updatedArray);
  });

  it('работает с нулевой задержкой', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 0 },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 0 });

    // При нулевой задержке значение обновляется сразу
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current).toBe('updated');
  });

  it('очищает таймер при размонтировании', () => {
    const { unmount } = renderHook(() => useDebounce('test', 1000));

    // Проверяем, что нет ошибок при размонтировании
    expect(() => unmount()).not.toThrow();
  });

  it('работает с большими задержками', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 5000 },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 5000 });

    // Проходим задержку
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current).toBe('updated');
  });
});
