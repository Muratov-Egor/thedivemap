import React from 'react';
import { Icon } from './Icon';

interface LinkIconProps {
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function LinkIcon(props: LinkIconProps) {
  return <Icon name="Link" {...props} />;
}
