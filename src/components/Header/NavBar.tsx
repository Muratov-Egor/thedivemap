import AuthNav from './AuthNav';
import GuestNav from './GuestNav';
import { User } from '@/lib/auth/session';

interface NavBarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function NavBar({ user, onLogin, onLogout }: NavBarProps) {
  if (user) {
    return <AuthNav user={user} onLogout={onLogout} />;
  }

  return <GuestNav onLogin={onLogin} />;
}
