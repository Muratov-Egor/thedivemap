import React from 'react';
import { Icon } from './Icon';

interface MoonIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function MoonIcon(props: MoonIconProps) {
  return <Icon name="Moon" {...props} />;
}
