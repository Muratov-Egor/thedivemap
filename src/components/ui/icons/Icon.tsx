import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
  backgroundVariant?: 'primary' | 'secondary' | 'success' | 'info';
  'data-testid'?: string;
}

export function Icon({
  name,
  className = '',
  size = 24,
  scale = 100,
  withBackground = false,
  backgroundVariant = 'primary',
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
    // ПАСТЕЛЬНЫЕ ФОНЫ ДЛЯ ИКОНОК - плоский дизайн
    const backgroundStyles = {
      primary:
        'p-2 bg-pastel-blue/30 dark:bg-pastel-blue/20 rounded-lg border border-pastel-blue/20',
      secondary:
        'p-2 bg-pastel-turquoise/30 dark:bg-pastel-turquoise/20 rounded-lg border border-pastel-turquoise/20',
      success:
        'p-2 bg-pastel-green/30 dark:bg-pastel-green/20 rounded-lg border border-pastel-green/20',
      info: 'p-2 bg-pastel-yellow/30 dark:bg-pastel-yellow/20 rounded-lg border border-pastel-yellow/20',
    };

    return <div className={backgroundStyles[backgroundVariant]}>{iconContent}</div>;
  }

  return iconContent;
}
