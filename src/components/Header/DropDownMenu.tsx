'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, DiverIcon, MapIcon, StarIcon } from '../ui/icons';
import { useIsMobile } from '@/hooks/useMediaQuery';

export default function DropDownMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Блокируем скролл body при открытом меню
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Закрытие меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      {/* Кнопка-триггер */}
      <Button
        variant="glass"
        shape="pill"
        size={isMobile ? 'small' : 'small'}
        onClick={handleToggle}
        className={cn(
          'transition-all duration-300 ease-in-out',
          isOpen && 'bg-glass-bg/80 border-gray-300 dark:border-gray-500 shadow-simple-hover',
          isMobile && 'px-3', // Компактнее на мобильных
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-action/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-action">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          {/* Показываем имя только на десктопе */}
          <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.name || 'User'}
          </span>
          <ChevronDownIcon
            className={cn(
              'w-4 h-4 transition-transform duration-300 ease-in-out text-gray-500 dark:text-gray-400',
              isOpen && 'rotate-180',
            )}
          />
        </div>
      </Button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className={cn('absolute right-0 top-full mt-2 z-50', isMobile ? 'w-72' : 'w-64')}>
          {/* Контейнер меню */}
          <div className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl shadow-simple-hover backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
            {/* Заголовок */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-action/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-action">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Пункты меню */}
            <div className="py-2">
              <Link
                href="/profile"
                onClick={handleClose}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 group"
              >
                <DiverIcon
                  size={20}
                  scale={200}
                  withBackground={true}
                  className="text-primary-action group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-medium">Профиль</span>
              </Link>

              <Link
                href="/logbook"
                onClick={handleClose}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 group"
              >
                <MapIcon
                  size={20}
                  withBackground={true}
                  scale={200}
                  className="text-info-accent group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-medium">Дайв-лог</span>
              </Link>

              <Link
                href="/favorites"
                onClick={handleClose}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 group"
              >
                <StarIcon
                  size={20}
                  scale={200}
                  withBackground={true}
                  className="text-warning-accent group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-medium">Избранное</span>
              </Link>
            </div>

            {/* Разделитель */}
            <div className="border-t border-gray-100 dark:border-slate-700 my-2"></div>

            {/* Кнопка выхода */}
            <div className="px-4 py-2">
              <Button
                variant="danger"
                shape="pill"
                size="small"
                onClick={handleLogout}
                className="w-full justify-center"
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
