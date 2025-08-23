import React from 'react';
import { Icon } from './Icon';

interface CheckIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function CheckIcon(props: CheckIconProps) {
  return <Icon name="Check" {...props} />;
}
