import React from 'react';
import { Icon } from './Icon';

interface TechDiverIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function TechDiverIcon(props: TechDiverIconProps) {
  return <Icon name="Tech Diver" {...props} />;
}
