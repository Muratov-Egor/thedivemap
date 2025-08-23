import React from 'react';
import { Icon } from './Icon';

interface VisibilityIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function VisibilityIcon(props: VisibilityIconProps) {
  return <Icon name="Visabilty" {...props} />;
}
