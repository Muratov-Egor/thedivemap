import React from 'react';
import { Icon } from './Icon';

interface MarkIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function MarkIcon(props: MarkIconProps) {
  return <Icon name="Mark" {...props} />;
}
