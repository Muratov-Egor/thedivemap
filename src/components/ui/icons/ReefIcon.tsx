import React from 'react';
import { Icon } from './Icon';

interface ReefIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function ReefIcon(props: ReefIconProps) {
  return <Icon name="Reef" {...props} />;
}
