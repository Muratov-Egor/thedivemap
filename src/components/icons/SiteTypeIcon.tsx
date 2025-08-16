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
          <span className={className} data-testid="site-type-icon">
            🪸
          </span>
        );
      case 2: // Wreck
        return (
          <span className={className} data-testid="site-type-icon">
            🚢
          </span>
        );
      case 3: // Cave
        return (
          <span className={className} data-testid="site-type-icon">
            🕳️
          </span>
        );
      case 4: // Bay
        return (
          <span className={className} data-testid="site-type-icon">
            🌊
          </span>
        );
      case 5: // Wall
        return (
          <span className={className} data-testid="site-type-icon">
            🏔️
          </span>
        );
      case 6: // Artificial reef
        return (
          <span className={className} data-testid="site-type-icon">
            🏗️
          </span>
        );
      case 9: // Pinnacle
        return (
          <span className={className} data-testid="site-type-icon">
            🗻
          </span>
        );
      case 10: // Coral garden
        return (
          <span className={className} data-testid="site-type-icon">
            🌸
          </span>
        );
      case 11: // Lake
        return (
          <span className={className} data-testid="site-type-icon">
            🏞️
          </span>
        );
      case 12: // Default
      default:
        return (
          <span className={className} data-testid="site-type-icon">
            📍
          </span>
        );
    }
  };

  return getIcon(siteTypeId);
}
