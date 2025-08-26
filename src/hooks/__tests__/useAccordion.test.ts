import { renderHook, act } from '@testing-library/react';
import { useAccordion } from '../useAccordion';

describe('useAccordion', () => {
  it('инициализируется с закрытым состоянием', () => {
    const { result } = renderHook(() => useAccordion());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.accordionRef.current).toBe(null);
  });

  it('переключает состояние при вызове toggle', () => {
    const { result } = renderHook(() => useAccordion());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('закрывает аккордеон при вызове close', () => {
    const { result } = renderHook(() => useAccordion());

    // Сначала открываем
    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);

    // Затем закрываем
    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('предоставляет ref для аккордеона', () => {
    const { result } = renderHook(() => useAccordion());

    expect(result.current.accordionRef).toBeDefined();
    expect(typeof result.current.accordionRef.current).toBe('object');
  });
});
