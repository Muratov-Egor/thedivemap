'use client';

import NavBar from './NavBar';
import Logo from './Logo';

export default function Header() {
  return (
    <header
      className="sm:py-2 sm:px-10 p-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 min-h-[4rem] bg-background transition-colors"
      suppressHydrationWarning
    >
      <Logo />
      <NavBar />
    </header>
  );
}
