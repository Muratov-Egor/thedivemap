import React from 'react';
import { Icon } from './Icon';

interface StarIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function StarIcon(props: StarIconProps) {
  return <Icon name="Star" {...props} />;
}
