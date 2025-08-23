import React from 'react';
import { Icon } from './Icon';

interface MapIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function MapIcon(props: MapIconProps) {
  return <Icon name="Map" {...props} />;
}
