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
    return theme === 'dark' ? <MoonIcon size={18} /> : <SunIcon size={18} />;
  };

  const getTooltipText = () => {
    return theme === 'dark' ? t('theme.light') : t('theme.dark');
  };

  const getButtonColor = () => {
    return theme === 'dark' ? 'glass' : 'coral';
  };

  return (
    <Button
      onClick={toggleTheme}
      variant='glass'
      size="small"
      shape="pill"
      icon={getIcon()}
      className={className}
      aria-label={getTooltipText()}
      title={getTooltipText()}
    />
  );
}
