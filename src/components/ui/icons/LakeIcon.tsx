import React from 'react';
import { Icon } from './Icon';

interface LakeIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function LakeIcon(props: LakeIconProps) {
  return <Icon name="Lake" {...props} />;
}
