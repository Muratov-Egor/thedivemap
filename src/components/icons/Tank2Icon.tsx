import React from 'react';
import { Icon } from './Icon';

interface Tank2IconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function Tank2Icon(props: Tank2IconProps) {
  return <Icon name="Tank 2" {...props} />;
}
