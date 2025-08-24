import React from 'react';
import { Icon } from './Icon';

interface DiverIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function DiverIcon(props: DiverIconProps) {
  return <Icon name="Diver" {...props} />;
}
