'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@/components/icons';
import Button from '@/components/ui/Button';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation('common');

  const getIcon = () => {
    return theme === 'dark' ? <MoonIcon size={22} /> : <SunIcon size={22} />;
  };

  const getTooltipText = () => {
    return theme === 'dark' ? t('theme.light') : t('theme.dark');
  };

  const getButtonColor = () => {
    return theme === 'dark' ? 'glass' : 'sun';
  };

  return (
    <Button
      onClick={toggleTheme}
      variant={getButtonColor()}
      size="small"
      shape="pill"
      icon={getIcon()}
      className={className}
      aria-label={getTooltipText()}
      title={getTooltipText()}
    />
  );
}
