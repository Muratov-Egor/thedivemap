'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface NotificationProps {
  message: string;
  description?: string;
  icon?: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success' | 'custom';
  duration?: number; // в миллисекундах, 0 = не скрывать автоматически
  onClose?: () => void;
  show?: boolean;
  className?: string;
  containerClassName?: string;
  iconClassName?: string;
  closeButtonClassName?: string;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  description,
  icon,
  type = 'info',
  duration = 5000,
  onClose,
  show = true,
  className,
  containerClassName,
  iconClassName,
  closeButtonClassName,
}) => {
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(show);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      setIsExiting(false);
    }
  }, [show]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // время анимации выхода
  }, [onClose]);

  useEffect(() => {
    if (!isVisible || duration === 0) return;

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, handleClose]);

  if (!isVisible) return null;

  // МИНИМАЛИСТИЧНАЯ ПАСТЕЛЬНАЯ СИСТЕМА - Option C: Balanced Minimal Design
  const typeStyles = {
    info: {
      container:
        'bg-pastel-turquoise dark:bg-pastel-turquoise border-l-4 border-outline-purple shadow-simple',
      icon: 'text-outline-purple dark:text-outline-purple',
      closeButton:
        'text-outline-purple/70 dark:text-outline-purple/70 hover:text-outline-purple dark:hover:text-outline-purple hover:bg-white/10 dark:hover:bg-black/20',
    },
    warning: {
      container:
        'bg-pastel-yellow dark:bg-pastel-yellow border-l-4 border-outline-purple shadow-simple',
      icon: 'text-outline-purple dark:text-outline-purple',
      closeButton:
        'text-outline-purple/70 dark:text-outline-purple/70 hover:text-outline-purple dark:hover:text-outline-purple hover:bg-white/10 dark:hover:bg-black/20',
    },
    error: {
      container:
        'bg-pastel-pink dark:bg-pastel-pink border-l-4 border-outline-purple shadow-simple',
      icon: 'text-outline-purple dark:text-outline-purple',
      closeButton:
        'text-outline-purple/70 dark:text-outline-purple/70 hover:text-outline-purple dark:hover:text-outline-purple hover:bg-white/10 dark:hover:bg-black/20',
    },
    success: {
      container:
        'bg-pastel-green dark:bg-pastel-green border-l-4 border-outline-purple shadow-simple',
      icon: 'text-outline-purple dark:text-outline-purple',
      closeButton:
        'text-outline-purple/70 dark:text-outline-purple/70 hover:text-outline-purple dark:hover:text-outline-purple hover:bg-white/10 dark:hover:bg-black/20',
    },
    custom: {
      container: '',
      icon: '',
      closeButton: '',
    },
  };

  const currentStyles = typeStyles[type] || typeStyles.custom;

  return (
    <div
      data-testid="notification"
      className={cn(
        'fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-[9999]',
        'max-w-xl w-auto sm:w-full',
        'transition-all duration-300 ease-in-out',
        isExiting ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100',
        className,
      )}
    >
      <div
                  className={cn(
            'rounded-2xl hover:shadow-simple-hover',
            'flex items-start gap-3 p-4',
            'transition-all duration-300 ease-in-out',
            currentStyles.container,
            containerClassName,
          )}
      >
        {/* Иконка */}
        {(icon || type !== 'custom') && (
          <div className={cn('flex-shrink-0 mt-0.5', currentStyles.icon, iconClassName)}>
            {icon ? (
              icon
            ) : (
              <>
                {type === 'info' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {type === 'warning' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {type === 'error' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {type === 'success' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </>
            )}
          </div>
        )}

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-outline-purple dark:text-white">{message}</div>
          {description && (
            <div className="text-sm text-outline-purple/80 dark:text-gray-300 mt-1">{description}</div>
          )}
        </div>

        {/* Кнопка закрытия */}
        <button
          data-testid="notification-close"
          onClick={handleClose}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-outline-purple/50 dark:focus:ring-outline-purple/50',
            'hover:scale-105 active:scale-95',
            currentStyles.closeButton,
            closeButtonClassName,
          )}
          aria-label={t('notification.close')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;
