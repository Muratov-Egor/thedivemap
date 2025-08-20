'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import { DiveSiteDetails } from '@/lib/types/supabase';

type PanelMode = 'filters' | 'info';

interface PanelContextType {
  panelMode: PanelMode;
  selectedDiveSite: DiveSiteDetails | null;
  setPanelMode: (mode: PanelMode) => void;
  selectDiveSite: (diveSite: DiveSiteDetails | null) => void;
  showFilters: () => void;
  showInfo: (diveSite: DiveSiteDetails) => void;
  clearDiveSite: () => void;
  setClearDiveSiteHook: (clearFn: () => void) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

interface PanelProviderProps {
  children: ReactNode;
}

export function PanelProvider({ children }: PanelProviderProps) {
  const router = useRouter();
  const [panelMode, setPanelMode] = useState<PanelMode>('filters');
  const [selectedDiveSite, setSelectedDiveSite] = useState<DiveSiteDetails | null>(null);
  const [clearDiveSiteHook, setClearDiveSiteHook] = useState<(() => void) | null>(null);
  const [shouldClearDiveSite, setShouldClearDiveSite] = useState(false);

  // Эффект для очистки состояния дайв-сайта
  useEffect(() => {
    if (shouldClearDiveSite && clearDiveSiteHook) {
      clearDiveSiteHook();
      setShouldClearDiveSite(false);
    }
  }, [shouldClearDiveSite, clearDiveSiteHook]);

  const selectDiveSite = useCallback((diveSite: DiveSiteDetails | null) => {
    setSelectedDiveSite(diveSite);
  }, []);

  const showFilters = useCallback(() => {
    setPanelMode('filters');
    setSelectedDiveSite(null);
    setShouldClearDiveSite(true);
    // Очищаем URL от site_id
    router.replace(window.location.pathname, { scroll: false });
  }, [router]);

  const showInfo = useCallback(
    (diveSite: DiveSiteDetails) => {
      setPanelMode('info');
      setSelectedDiveSite(diveSite);
      // Обновляем URL с site_id (без перезагрузки и центрирования карты)
      const url = new URL(window.location.href);
      url.searchParams.set('site_id', diveSite.id);
      router.replace(url.pathname + url.search, { scroll: false });
    },
    [router],
  );

  const clearDiveSite = useCallback(() => {
    setSelectedDiveSite(null);
  }, []);

  const setClearDiveSiteHookFn = useCallback((clearFn: () => void) => {
    setClearDiveSiteHook(() => clearFn);
  }, []);

  const value: PanelContextType = {
    panelMode,
    selectedDiveSite,
    setPanelMode,
    selectDiveSite,
    showFilters,
    showInfo,
    clearDiveSite,
    setClearDiveSiteHook: setClearDiveSiteHookFn,
  };

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
}

export function usePanel() {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error('usePanel must be used within a PanelProvider');
  }
  return context;
}
