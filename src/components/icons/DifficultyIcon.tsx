import React from 'react';
import { TankIcon, Tank2Icon, Tank3Icon, TechDiverIcon } from './index';

interface DifficultyIconProps {
  difficulty: 1 | 2 | 3;
  className?: string;
  size?: number;
  scale?: number;
  withBackground?: boolean;
}

export function DifficultyIcon({
  difficulty,
  className = '',
  size = 16,
  scale = 100,
  withBackground = false,
}: DifficultyIconProps) {
  const getDifficultyIcon = (level: number) => {
    switch (level) {
      case 1: // Beginner - один баллон
        return (
          <TankIcon
            size={size}
            scale={scale}
            withBackground={withBackground}
            className={className}
          />
        );
      case 2: // Intermediate - два баллона
        return (
          <Tank2Icon
            size={size}
            scale={scale}
            withBackground={withBackground}
            className={className}
          />
        );
      case 3: // Advanced - технический дайвер
        return (
          <Tank3Icon
            size={size}
            scale={scale}
            withBackground={withBackground}
            className={className}
          />
        );
      case 4: // Technical diver - технический дайвер
        return (
          <TechDiverIcon
            size={size}
            scale={scale}
            withBackground={withBackground}
            className={className}
          />
        );
      default:
        return (
          <TankIcon
            size={size}
            scale={scale}
            withBackground={withBackground}
            className={className}
          />
        );
    }
  };

  return getDifficultyIcon(difficulty);
}
