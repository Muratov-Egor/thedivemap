import { Button } from '../ui';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { User } from '@/lib/auth/session';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { useAccordion } from '@/hooks/useAccordion';

interface AuthNavProps {
  user: User;
  onLogout: () => void;
}

export default function AuthNav({ user, onLogout }: AuthNavProps) {
  const { t } = useTranslation('common');
  const isMobile = useIsMobile();
  const { close } = useAccordion();

  const handleLogout = () => {
    onLogout();
    close();
  };

  // Десктопная версия
  if (!isMobile) {
    return (
      <DesktopNav>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {user.name || user.email}
          </span>
          <Button
            variant="secondary"
            shape="pill"
            size="small"
            aria-label={t('header.logout')}
            onClick={handleLogout}
          >
            {t('header.logout')}
          </Button>
        </div>
      </DesktopNav>
    );
  }

  // Мобильная версия
  return (
    <MobileNav>
      <div className="space-y-3">
        <div className="text-sm text-gray-600 dark:text-gray-400">{user.name || user.email}</div>
        <Button
          variant="secondary"
          shape="pill"
          size="small"
          className="w-full"
          aria-label={t('header.logout')}
          onClick={handleLogout}
        >
          {t('header.logout')}
        </Button>
      </div>
    </MobileNav>
  );
}
