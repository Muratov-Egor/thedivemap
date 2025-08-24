import React from 'react';
import { Icon } from './Icon';

interface ArtificialReefIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function ArtificialReefIcon(props: ArtificialReefIconProps) {
  return <Icon name="Artificial Reef" {...props} />;
}
