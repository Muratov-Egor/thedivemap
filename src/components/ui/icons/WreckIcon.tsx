import React from 'react';
import { Icon } from './Icon';

interface WreckIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function WreckIcon(props: WreckIconProps) {
  return <Icon name="Wreck" {...props} />;
}
