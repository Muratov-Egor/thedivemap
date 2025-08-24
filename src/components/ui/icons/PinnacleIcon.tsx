import React from 'react';
import { Icon } from './Icon';

interface PinnacleIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function PinnacleIcon(props: PinnacleIconProps) {
  return <Icon name="Pinnacle" {...props} />;
}
