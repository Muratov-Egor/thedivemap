import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function Logo() {
  const { t } = useTranslation('common');

  return (
    <Link
      href="/"
      className="flex sm:gap-2 gap-1 items-center hover:no-underline pr-4"
      suppressHydrationWarning
    >
      <Image
        src="/img/Logo.ico"
        alt=""
        width={64}
        height={64}
        className="sm:w-24 sm:h-24 w-16 h-16 flex-shrink-0"
        data-testid="header-logo"
      />
      <div className="flex flex-col gap-1 min-w-0">
        <h1
          className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white"
          suppressHydrationWarning
        >
          {t('appName')}
        </h1>
        <p
          className="sm:text-lg text-xs text-gray-600 dark:text-gray-400 "
          suppressHydrationWarning
        >
          {t('header.motto')}
        </p>
      </div>
    </Link>
  );
}
