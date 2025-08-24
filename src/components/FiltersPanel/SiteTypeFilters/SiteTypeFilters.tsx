'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from '@/contexts/MapContext';
import { useFilters } from '@/hooks/useFilters';
import Chip from '@/components/ui/Chip/Chip';
import { SiteTypeIcon } from '@/components/ui/icons';

export default function SiteTypeFilters() {
  const { t } = useTranslation('filters');
  const { activeFilters, setSiteTypeFilter } = useMap();
  const { filters } = useFilters();

  const handleSiteTypeClick = (siteTypeId: number) => {
    setSiteTypeFilter(siteTypeId);
  };

  // Если фильтры еще не загружены, не рендерим компонент
  if (!filters) {
    return null;
  }

  return (
    <div className="space-y-3" data-testid="site-type-filters">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
          suppressHydrationWarning
        >
          {t('siteTypes.title')}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.site_types.map((siteType) => (
          <Chip
            key={siteType.id}
            selected={activeFilters.siteTypeIds.includes(siteType.id)}
            onClick={() => handleSiteTypeClick(siteType.id)}
            data-testid={`site-type-filter-${siteType.id}`}
            aria-label={`${t('siteTypes.filterBy')} ${siteType.label}`}
          >
            <div className="flex items-center gap-2">
              <SiteTypeIcon siteTypeId={siteType.id} className="w-4 h-4" />
              <span>{siteType.label}</span>
            </div>
          </Chip>
        ))}
      </div>
    </div>
  );
}
