import React from 'react';
import { Icon } from './Icon';

interface SunIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function SunIcon(props: SunIconProps) {
  return <Icon name="Sun" {...props} />;
}
