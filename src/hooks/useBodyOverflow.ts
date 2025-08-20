import { useEffect } from 'react';

export const useBodyOverflow = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущее состояние overflow
      const originalOverflow = document.body.style.overflow;
      const originalOverflowX = document.body.style.overflowX;

      // Блокируем горизонтальный скролл
      document.body.style.overflowX = 'hidden';

      // Если был вертикальный скролл, сохраняем его
      if (originalOverflow && !originalOverflow.includes('hidden')) {
        document.body.style.overflow = originalOverflow;
      }

      return () => {
        // Восстанавливаем оригинальное состояние
        document.body.style.overflow = originalOverflow;
        document.body.style.overflowX = originalOverflowX;
      };
    }
  }, [isOpen]);
};
