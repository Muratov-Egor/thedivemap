import React from 'react';
import { Icon } from './Icon';

interface RiverIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function RiverIcon(props: RiverIconProps) {
  return <Icon name="River" {...props} />;
}
