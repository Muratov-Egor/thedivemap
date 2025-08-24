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
  RiverIcon,
  MaskIcon,
} from './index';

interface IconProps {
  className?: string;
}

interface SiteTypeIconProps extends IconProps {
  siteTypeId: number;
  scale?: number;
}

export default function SiteTypeIcon({
  siteTypeId,
  className = 'w-4 h-4',
  scale = 200,
}: SiteTypeIconProps) {
  const getIcon = (id: number) => {
    switch (id) {
      case 1: // Reef
        return (
          <ReefIcon
            size={16}
            withBackground
            className={className}
            data-testid="site-type-icon-reef"
            scale={scale}
          />
        );
      case 2: // Wreck
        return (
          <WreckIcon
            size={16}
            withBackground
            className={className}
            data-testid="site-type-icon-wreck"
            scale={scale}
          />
        );
      case 3: // Cave
        return (
          <CaveIcon
            size={16}
            withBackground
            className={className}
            data-testid="site-type-icon-cave"
            scale={scale}
          />
        );
      case 4: // Bay
        return (
          <BayIcon
            size={16}
            withBackground
            className={className}
            data-testid="site-type-icon-bay"
            scale={scale}
          />
        );
      case 8: // River
        return (
          <RiverIcon
            size={16}
            withBackground
            className={className}
            data-testid="site-type-icon-river"
            scale={scale}
          />
        );
      case 6: // Artificial reef
        return (
          <ArtificialReefIcon
            size={16}
            withBackground
            className={className}
            data-testid="site-type-icon-artificial-reef"
            scale={scale}
          />
        );
      case 9: // Pinnacle
        return (
          <PinnacleIcon
            size={16}
            withBackground
            className={className}
            data-testid="site-type-icon-pinnacle"
            scale={scale}
          />
        );
      case 10: // Coral garden
        return (
          <CoralGardenIcon
            size={16}
            withBackground
            className={className}
            data-testid="site-type-icon-coral-garden"
            scale={scale}
          />
        );
      case 11: // Lake
        return (
          <LakeIcon
            size={16}
            withBackground
            className={className}
            data-testid="site-type-icon-lake"
            scale={scale}
          />
        );
      case 12: // Default
      default:
        return (
          <MaskIcon
            size={16}
            withBackground
            className={className}
            data-testid="site-type-icon-mark"
            scale={scale}
          />
        );
    }
  };

  return getIcon(siteTypeId);
}
