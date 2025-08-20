'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from '@/components/LanguageSwitch';
import Button from './ui/Button';

export default function Header() {
  const { t } = useTranslation('common');

  return (
    <header className="sm:py-2 sm:px-10 p-2 flex justify-between items-center border-b border-gray-200 min-h-[4rem]">
      <Link href="/" className="flex sm:gap-2 gap-1 items-center hover:underline pr-4 ">
        <Image
          src="/img/Logo.ico"
          alt=""
          width={64}
          height={64}
          className="sm:w-24 sm:h-24 w-16 h-16"
          data-testid="header-logo"
        />
        <h1 className="text-xl sm:text-3xl font-bold" suppressHydrationWarning>
          {t('appName')}
        </h1>
      </Link>
      <div className="flex items-center gap-4 sm:mr-10 mr-4">
        <Button
          variant="coral"
          shape="pill"
          size="small"
          aria-label={t('header.login')}
          onClick={() => alert('Тут будет форма авторизации или переход на новую страницу')}
        >
          {t('header.login')}
        </Button>
        <LanguageSwitch />
      </div>
    </header>
  );
}
