import React from 'react';
import { Icon } from './Icon';

interface BayIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function BayIcon(props: BayIconProps) {
  return <Icon name="Bay" {...props} />;
}
