'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'thedivemap-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Применение темы к документу
  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof document === 'undefined') return;

    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  // Установка темы
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      applyTheme(newTheme);

      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      }
    },
    [applyTheme],
  );

  // Переключение темы
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Инициализация темы при загрузке
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized) return;

    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const initialTheme = savedTheme || 'light';

    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setIsInitialized(true);
  }, [applyTheme, isInitialized]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
