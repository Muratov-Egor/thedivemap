'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from '@/contexts/MapContext';
import { useFilters } from '@/hooks/useFilters';
import Chip from '../Chip/Chip';

export default function SiteTypeFilters() {
  const { t } = useTranslation('filters');
  const { activeFilters, setSiteTypeFilter } = useMap();
  const { filters, loading } = useFilters();

  const handleSiteTypeClick = (siteTypeId: number) => {
    setSiteTypeFilter(siteTypeId);
  };

  if (loading || !filters) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">{t('siteTypes.title')}</h3>
          <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-8 w-20 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{t('siteTypes.title')}</h3>
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
            {siteType.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
