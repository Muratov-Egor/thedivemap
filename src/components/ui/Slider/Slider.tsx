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
  variant?: 'default' | 'depth' | 'visibility' | 'rating';
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

    // ===== ИСПРАВЛЕННАЯ КОНТРАСТНАЯ СИСТЕМА =====
    const variantStyles = {
      default: {
        track: 'bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600',
        filled: 'bg-primary-action',
        thumb: 'bg-white dark:bg-slate-800 border-2 border-primary-action shadow-simple',
        thumbHover: 'hover:scale-110 hover:shadow-simple-hover hover:border-blue-600',
      },
      depth: {
        track: 'bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600',
        filled: 'bg-primary-action dark:bg-blue-400',
        thumb:
          'bg-white dark:bg-primary-action border-2 border-primary-action dark:border-white shadow-simple',
        thumbHover:
          'hover:scale-110 hover:shadow-simple-hover hover:border-blue-600 dark:hover:border-blue-300',
      },
      visibility: {
        track: 'bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600',
        filled: 'bg-blue-200 dark:bg-blue-200',
        thumb: 'bg-white dark:bg-blue-200 border-2 border-blue-200 dark:border-white shadow-simple',
        thumbHover:
          'hover:scale-110 hover:shadow-simple-hover hover:border-blue-600 dark:hover:border-blue-300',
      },
      rating: {
        track: 'bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600',
        filled: 'bg-secondary-action dark:bg-gray-400',
        thumb:
          'bg-white dark:bg-slate-800 border-2 border-secondary-action dark:border-gray-400 shadow-simple',
        thumbHover:
          'hover:scale-110 hover:shadow-simple-hover hover:border-gray-600 dark:hover:border-gray-300',
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
              'relative w-full h-4 rounded-full cursor-pointer transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary-action/50 focus:ring-offset-2',
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
                'absolute top-0 left-0 h-full rounded-full transition-all duration-200 ease-out',
                currentVariant.filled,
              )}
              style={{ width: `${percentage}%` }}
            />

            {/* Ползунок */}
            <div
              ref={thumbRef}
              className={cn(
                'absolute top-1/2 w-7 h-7 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-all duration-200 ease-out focus:outline-none focus:scale-110 focus:ring-2 focus:ring-primary-action/50',
                currentVariant.thumb,
                currentVariant.thumbHover,
                isDragging && 'scale-125 border-4',
                disabled && 'cursor-not-allowed opacity-50',
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
                className="text-sm font-semibold text-black dark:text-white bg-background dark:bg-gray-800 px-3 py-1.5 rounded-xl shadow-simple border border-outline-purple/20 dark:border-gray-600"
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
