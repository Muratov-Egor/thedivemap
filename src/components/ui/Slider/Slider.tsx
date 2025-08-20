'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  variant?: 'default' | 'coral' | 'ocean';
  dataTestId?: string | 'slider';
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value: controlledValue,
      defaultValue = 50,
      onChange,
      onValueChange,
      disabled = false,
      className,
      label,
      showValue = true,
      valuePrefix = '',
      valueSuffix = '',
      variant = 'default',
      dataTestId,
    },
    ref,
  ) => {
    const [value, setValue] = useState(controlledValue ?? defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    // Обновляем значение при изменении controlledValue
    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue);
      }
    }, [controlledValue]);

    const handleValueChange = (newValue: number) => {
      const clampedValue = Math.max(min, Math.min(max, newValue));
      setValue(clampedValue);
      onValueChange?.(clampedValue);
      onChange?.(clampedValue);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return;
      setIsDragging(true);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      handleMouseMove(e);
    };

    const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const clientX = 'clientX' in e ? e.clientX : (e as React.MouseEvent).nativeEvent.clientX;
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newValue = min + percentage * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      handleValueChange(steppedValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Touch события для мобильных устройств
    const handleTouchStart = (e: React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      handleTouchMove(e);
    };

    const handleTouchMove = (e: TouchEvent | React.TouchEvent) => {
      if (!sliderRef.current) return;
      e.preventDefault();

      const rect = sliderRef.current.getBoundingClientRect();
      const touch = 'touches' in e ? e.touches[0] : (e as React.TouchEvent).nativeEvent.touches[0];
      const clientX = touch.clientX;
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newValue = min + percentage * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      handleValueChange(steppedValue);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      let newValue = value;
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = value - step;
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = value + step;
          break;
        case 'Home':
          newValue = min;
          break;
        case 'End':
          newValue = max;
          break;
        case 'PageDown':
          newValue = value - step * 10;
          break;
        case 'PageUp':
          newValue = value + step * 10;
          break;
        default:
          return;
      }

      e.preventDefault();
      handleValueChange(newValue);
    };

    const percentage = ((value - min) / (max - min)) * 100;

    const variantStyles = {
      default: {
        track: 'bg-gradient-to-r from-slate-200 to-slate-300',
        filled: 'bg-gradient-to-r from-tropical-blue to-deep-ocean',
        thumb: 'bg-gradient-to-r from-tropical-blue to-deep-ocean shadow-glow-blue',
        thumbHover: 'hover:shadow-glow-hover',
      },
      coral: {
        track: 'bg-gradient-to-r from-red-200 to-orange-200',
        filled: 'bg-gradient-to-r from-coral to-orange-500',
        thumb: 'bg-gradient-to-r from-coral to-orange-500 shadow-glow-coral',
        thumbHover: 'hover:shadow-glow-coral',
      },
      ocean: {
        track: 'bg-gradient-to-r from-blue-200 to-cyan-200',
        filled: 'bg-gradient-to-r from-deep-ocean to-cyan-500',
        thumb: 'bg-gradient-to-r from-deep-ocean to-cyan-500 shadow-glow-blue',
        thumbHover: 'hover:shadow-glow-hover',
      },
    };

    const currentVariant = variantStyles[variant];

    return (
      <div ref={ref} className={cn('w-full', className)} data-testid={dataTestId}>
        {label && (
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            suppressHydrationWarning
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Слайдер трек */}
          <div
            ref={sliderRef}
            className={cn(
              'relative w-full h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl cursor-pointer transition-all duration-100 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
              currentVariant.track,
              disabled && 'opacity-50 cursor-not-allowed',
            )}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            role="slider"
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            suppressHydrationWarning
          >
            {/* Заполненная часть трека */}
            <div
              className={cn(
                'absolute top-0 left-0 h-full rounded-2xl transition-all duration-100 ease-in-out',
                currentVariant.filled,
              )}
              style={{ width: `${percentage}%` }}
            />

            {/* Ползунок */}
            <div
              ref={thumbRef}
              className={cn(
                'absolute top-1/2 w-8 h-8 rounded-full border-2 border-white shadow-glow transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-100 ease-in-out hover:shadow-glow-hover',
                currentVariant.thumb,
                currentVariant.thumbHover,
                isDragging && 'scale-110 shadow-xl',
                disabled && 'cursor-not-allowed',
              )}
              style={{ left: `${percentage}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            />
          </div>

          {/* Отображение значения */}
          {showValue && (
            <div className="mt-3 flex justify-between items-center">
              <span
                className="text-xs text-slate-500 dark:text-slate-400 font-medium"
                suppressHydrationWarning
              >
                {valuePrefix}
                {min}
                {valueSuffix}
              </span>
              <span
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 rounded-2xl shadow-glass border border-slate-200 dark:border-slate-600 backdrop-blur-sm"
                data-testid={`${dataTestId}-value`}
                suppressHydrationWarning
              >
                {valuePrefix}
                {value}
                {valueSuffix}
              </span>
              <span
                className="text-xs text-slate-500 dark:text-slate-400 font-medium"
                suppressHydrationWarning
              >
                {valuePrefix}
                {max}
                {valueSuffix}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

Slider.displayName = 'Slider';

export default Slider;
