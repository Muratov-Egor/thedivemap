import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sm:p-4 p-2">
      <div className="container mx-auto">
        <Link href="/" className="flex sm:gap-2 gap-1 items-center hover:underline">
          <Image
            src="/img/Logo.ico"
            alt="The Dive Map"
            width={64}
            height={64}
            className="sm:w-32 sm:h-32 w-16 h-16"
            data-testid="header-logo"
          />
          <h1 className="text-xl sm:text-3xl font-bold">The Dive Map</h1> 
        </Link>
      </div>
    </header>
  );
}