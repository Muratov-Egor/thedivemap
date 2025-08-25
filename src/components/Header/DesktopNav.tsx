import { ReactNode } from 'react';

interface DesktopNavProps {
  children: ReactNode;
}

export default function DesktopNav({ children }: DesktopNavProps) {
  return <div className="flex items-center gap-4 sm:mr-10 mr-4">{children}</div>;
}
