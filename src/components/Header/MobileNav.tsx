import { Button } from '../ui';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from './LanguageSwitch';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MenuIcon, ChevronUpIcon } from '../ui/icons';
import { useAccordion } from '@/hooks/useAccordion';
import { ReactNode } from 'react';

interface MobileNavProps {
  children: ReactNode;
}

export default function MobileNav({ children }: MobileNavProps) {
  const { t } = useTranslation('common');
  const { isOpen, accordionRef, toggle } = useAccordion();

  return (
    <div className="relative mr-4" ref={accordionRef}>
      {/* Кнопка меню */}
      <Button
        variant="glass"
        shape="pill"
        size="medium"
        onClick={toggle}
        aria-label={isOpen ? t('header.menu.close') : t('header.menu.open')}
        aria-expanded={isOpen}
        icon={isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      />

      {/* Выпадающий список */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-background dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-52 z-50">
          <div className="p-4 space-y-4">
            {/* Основное содержимое */}
            {children}

            {/* Разделитель */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Настройки */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('header.menu.settings')}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('header.menu.theme')}
                  </span>
                </div>
                <ThemeToggle />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('header.menu.language')}
                  </span>
                </div>
                <LanguageSwitch />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
