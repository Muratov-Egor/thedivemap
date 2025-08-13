'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from '@/components/LanguageSwitch';

export default function Header() {
  const { t } = useTranslation('common');
  return (
    <header className="sm:p-4 p-2 flex justify-between items-center border-b border-gray-200">
      <Link href="/" className="flex sm:gap-2 gap-1 items-center hover:underline pr-4">
        <Image
          src="/img/Logo.ico"
          alt=""
          width={64}
          height={64}
          className="sm:w-24 sm:h-24 w-16 h-16"
          data-testid="header-logo"
        />
        <h1 className="text-xl sm:text-3xl font-bold">{t('appName')}</h1>
      </Link>
      <LanguageSwitch />
    </header>
  );
}
