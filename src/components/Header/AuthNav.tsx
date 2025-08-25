import { Button, DropdownMenu } from '../ui';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { User } from '@/lib/auth/session';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { useAccordion } from '@/hooks/useAccordion';
import { ChevronDownIcon } from '../ui/icons';
import { useRouter } from 'next/navigation';

interface AuthNavProps {
  user: User;
  onLogout: () => void;
}

export default function AuthNav({ user, onLogout }: AuthNavProps) {
  const { t } = useTranslation('common');
  const isMobile = useIsMobile();
  const { close } = useAccordion();
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    close();
  };

  const handleProfile = () => {
    router.push('/profile');
    close();
  };

  const handleLogbook = () => {
    router.push('/logbook');
    close();
  };

  const dropdownItems = [
    {
      id: 'profile',
      label: t('header.profile'),
      onClick: handleProfile,
    },
    {
      id: 'logbook',
      label: t('header.logbook'),
      onClick: handleLogbook,
    },
    {
      id: 'logout',
      label: t('header.logout'),
      onClick: handleLogout,
      variant: 'danger' as const,
    },
  ];

  // Десктопная версия
  if (!isMobile) {
    return (
      <DesktopNav>
        <DropdownMenu
          trigger={
            <Button
              variant="glass"
              shape="pill"
              size="small"
              icon={<ChevronDownIcon className="w-4 h-4" />}
              iconPosition="right"
              className="gap-2"
            >
              {user.name || user.email}
            </Button>
          }
          items={dropdownItems}
          align="right"
        />
      </DesktopNav>
    );
  }

  // Мобильная версия
  return (
    <MobileNav>
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {user.name || user.email}
        </div>
        <button
          onClick={handleProfile}
          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500/50 rounded-lg"
        >
          {t('header.profile')}
        </button>
        <button
          onClick={handleLogbook}
          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500/50 rounded-lg"
        >
          {t('header.logbook')}
        </button>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500/50 rounded-lg"
        >
          {t('header.logout')}
        </button>
      </div>
    </MobileNav>
  );
}
