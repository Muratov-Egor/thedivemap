import React from 'react';
import { Icon } from './Icon';

interface CaveIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function CaveIcon(props: CaveIconProps) {
  return <Icon name="Cave" {...props} />;
}
