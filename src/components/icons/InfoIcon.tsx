import React from 'react';
import { Icon } from './Icon';

interface InfoIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function InfoIcon(props: InfoIconProps) {
  return <Icon name="Info" {...props} />;
}
