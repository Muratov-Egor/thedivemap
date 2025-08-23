import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
  'data-testid'?: string;
}

export function Icon({
  name,
  className = '',
  size = 24,
  scale = 100,
  withBackground = false,
  'data-testid': testId,
}: IconProps) {
  const scaleValue = scale / 100; // Преобразуем scale в десятичное значение

  const iconContent = (
    <div
      className={`bg-contain bg-no-repeat bg-center ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(/img/${encodeURIComponent(name)}.svg)`,
        transform: `scale(${scaleValue})`,
        transformOrigin: 'center',
      }}
      data-testid={testId}
    />
  );

  if (withBackground) {
    return <div className="p-2 bg-tropical-blue/15 rounded-lg">{iconContent}</div>;
  }

  return iconContent;
}
