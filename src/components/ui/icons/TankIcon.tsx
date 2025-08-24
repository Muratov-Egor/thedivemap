import React from 'react';
import { Icon } from './Icon';

interface TankIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function TankIcon(props: TankIconProps) {
  return <Icon name="Tank" {...props} />;
}
