import React from 'react';
import { Icon } from './Icon';

interface Tank3IconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function Tank3Icon(props: Tank3IconProps) {
  return <Icon name="Tank 3" {...props} />;
}
