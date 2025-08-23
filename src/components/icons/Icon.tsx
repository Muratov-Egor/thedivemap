import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function Icon({ 
  name, 
  className = '', 
  size = 24, 
  scale = 100, 
  withBackground = false 
}: IconProps) {
  const scaleClass = `scale-${scale}`;

  const iconContent = (
    <div
      className={`bg-contain bg-no-repeat bg-center ${className} ${scaleClass}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(/img/${name}.svg)`
      }}
    />
  );

  if (withBackground) {
    return (
      <div className="p-2 bg-tropical-blue/15 rounded-lg">
        {iconContent}
      </div>
    );
  }

  return iconContent;
}
