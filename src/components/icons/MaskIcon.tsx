import React from 'react';
import { Icon } from './Icon';

interface MaskIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function MaskIcon(props: MaskIconProps) {
  return <Icon name="Mask" {...props} />;
}
