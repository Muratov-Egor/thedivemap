import React from 'react';
import { Icon } from './Icon';

interface DiveCenterIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function DiveCenterIcon(props: DiveCenterIconProps) {
  return <Icon name="DiveCenter" {...props} />;
}
