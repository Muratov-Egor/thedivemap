import React from 'react';
import { Icon } from './Icon';

interface TagIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function TagIcon(props: TagIconProps) {
  return <Icon name="Tag" {...props} />;
}
