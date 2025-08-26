import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import LanguageSwitch from './LanguageSwitch';

export default function Footer() {
  const { t } = useTranslation('footer');

  return (
    <footer className="bg-background dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
        <div className="flex flex-row items-center justify-end gap-4">
          <Link href="/privacy">{t('privacy')}</Link>
          <Link href="/about">{t('about')}</Link>
          <Link href="https://diversnotes.com/" target="_blank">
            {t('blog')}
          </Link>
        </div>

        <div className="flex flex-row items-center justify-end gap-4">
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </div>
    </footer>
  );
}
