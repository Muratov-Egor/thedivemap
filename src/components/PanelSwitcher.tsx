'use client';

import React from 'react';
import { usePanel } from '@/contexts/PanelContext';
import Filters from '@/components/FiltersPanel/Filters';
import InfoPanel from '@/components/InfoPanel/InfoPanel';

export default function PanelSwitcher() {
  const { panelMode, selectedDiveSite } = usePanel();

  return (
    <>
      {panelMode === 'filters' && <Filters />}
      {panelMode === 'info' && <InfoPanel diveSite={selectedDiveSite || undefined} />}
    </>
  );
}
