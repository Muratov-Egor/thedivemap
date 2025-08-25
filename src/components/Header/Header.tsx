'use client';

import NavBar from './NavBar';
import Logo from './Logo';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

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
      <NavBar user={user} onLogin={handleLogin} onLogout={handleLogout} />
    </header>
  );
}
