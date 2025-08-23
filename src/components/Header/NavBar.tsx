import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from './LanguageSwitch';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useIsMobile } from '@/hooks/useMediaQuery';

// Простая иконка меню
function MenuIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

// Иконка закрытия
function ChevronUpIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );
}

export default function NavBar() {
  const { t } = useTranslation('common');
  const isMobile = useIsMobile();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  // Закрытие аккордеона при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accordionRef.current && !accordionRef.current.contains(event.target as Node)) {
        setIsAccordionOpen(false);
      }
    };

    if (isAccordionOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccordionOpen]);

  // Десктопная версия
  if (!isMobile) {
    return (
      <div className="flex items-center gap-4 sm:mr-10 mr-4">
        <Button
          variant="primary"
          shape="pill"
          size="small"
          aria-label={t('header.login')}
          onClick={() => alert('Тут будет форма авторизации или переход на новую страницу')}
        >
          {t('header.login')}
        </Button>
        <LanguageSwitch />
        <ThemeToggle />
      </div>
    );
  }

  // Мобильная версия с аккордеоном
  return (
    <div className="relative mr-4" ref={accordionRef}>
      {/* Кнопка меню */}
      <Button
        variant="secondary"
        shape="pill"
        size="medium"
        onClick={toggleAccordion}
        aria-label={isAccordionOpen ? t('header.menu.close') : t('header.menu.open')}
        aria-expanded={isAccordionOpen}
        icon={
          isAccordionOpen ? <ChevronUpIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />
        }
      />

      {/* Выпадающий список */}
      {isAccordionOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-52 z-50">
          <div className="p-4 space-y-4">
            {/* Кнопка входа */}
            <div>
              <Button
                variant="primary"
                shape="pill"
                size="small"
                className="w-full"
                aria-label={t('header.login')}
                onClick={() => {
                  alert('Тут будет форма авторизации или переход на новую страницу');
                  setIsAccordionOpen(false);
                }}
              >
                {t('header.login')}
              </Button>
            </div>

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
