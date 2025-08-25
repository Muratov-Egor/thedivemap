import { Button } from '../ui';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useMediaQuery';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { useAccordion } from '@/hooks/useAccordion';

interface GuestNavProps {
  onLogin: () => void;
}

export default function GuestNav({ onLogin }: GuestNavProps) {
  const { t } = useTranslation('common');
  const isMobile = useIsMobile();
  const { close } = useAccordion();

  const handleLogin = () => {
    onLogin();
    close();
  };

  // Десктопная версия
  if (!isMobile) {
    return (
      <DesktopNav>
        <Button
          variant="primary"
          shape="pill"
          size="small"
          aria-label={t('header.login')}
          onClick={handleLogin}
        >
          {t('header.login')}
        </Button>
      </DesktopNav>
    );
  }

  // Мобильная версия
  return (
    <MobileNav>
      <div>
        <Button
          variant="info"
          shape="pill"
          size="small"
          className="w-full"
          aria-label={t('header.login')}
          onClick={handleLogin}
        >
          {t('header.login')}
        </Button>
      </div>
    </MobileNav>
  );
}
