import React from 'react';
import { Icon } from './Icon';

interface DepthIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function DepthIcon(props: DepthIconProps) {
  return <Icon name="Deapth" {...props} />;
}
