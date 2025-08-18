import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Устанавливаем начальное значение
    setMatches(mediaQuery.matches);

    // Создаем обработчик изменений
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Добавляем слушатель
    mediaQuery.addEventListener('change', handleChange);

    // Очищаем слушатель при размонтировании
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// Предопределенные медиа-запросы для удобства
export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 767px)');
};

export const useIsDesktop = (): boolean => {
  return useMediaQuery('(min-width: 768px)');
};
