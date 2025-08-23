import React from 'react';
import { 
  ReefIcon, 
  WreckIcon, 
  CaveIcon, 
  BayIcon, 
  ArtificialReefIcon, 
  PinnacleIcon, 
  CoralGardenIcon, 
  LakeIcon, 
  MarkIcon 
} from './index';

interface IconProps {
  className?: string;
}

interface SiteTypeIconProps extends IconProps {
  siteTypeId: number;
}

export default function SiteTypeIcon({ siteTypeId, className = 'w-4 h-4' }: SiteTypeIconProps) {
  const getIcon = (id: number) => {
    switch (id) {
      case 1: // Reef
        return (
          <ReefIcon size={16} withBackground className={className} data-testid="site-type-icon" />
        );
      case 2: // Wreck
        return (
          <WreckIcon size={16} withBackground className={className} data-testid="site-type-icon" />
        );
      case 3: // Cave
        return (
          <CaveIcon size={16} withBackground className={className} data-testid="site-type-icon" />
        );
      case 4: // Bay
        return (
          <BayIcon size={16} withBackground className={className} data-testid="site-type-icon" />
        );
      case 5: // Wall - оставляем эмоджи, так как нет соответствующей иконки
        return (
          <span className={className} data-testid="site-type-icon">
            🏔️
          </span>
        );
      case 6: // Artificial reef
        return (
          <ArtificialReefIcon size={16} withBackground className={className} data-testid="site-type-icon" />
        );
      case 9: // Pinnacle
        return (
          <PinnacleIcon size={16} withBackground className={className} data-testid="site-type-icon" />
        );
      case 10: // Coral garden
        return (
          <CoralGardenIcon size={16} withBackground className={className} data-testid="site-type-icon" />
        );
      case 11: // Lake
        return (
          <LakeIcon size={16} withBackground className={className} data-testid="site-type-icon" />
        );
      case 12: // Default
      default:
        return (
          <MarkIcon size={16} withBackground className={className} data-testid="site-type-icon" />
        );
    }
  };

  return getIcon(siteTypeId);
}
