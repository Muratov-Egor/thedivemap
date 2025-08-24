import React from 'react';
import { Icon } from './Icon';

interface CoralGardenIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function CoralGardenIcon(props: CoralGardenIconProps) {
  return <Icon name="Coral Garden" {...props} />;
}
