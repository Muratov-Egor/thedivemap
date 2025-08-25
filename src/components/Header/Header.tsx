'use client';

import Logo from './Logo';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui';

export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <header
      className="sm:py-2 sm:px-10 p-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 min-h-[4rem] bg-background transition-colors"
      suppressHydrationWarning
    >
      <Logo />
      <div className="flex items-center gap-2">
        {user ? (
          <Button variant="glass" shape="pill" size="small" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button variant="glass" shape="pill" size="small" onClick={handleLogin}>
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
