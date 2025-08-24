import React from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <main className="h-full w-full flex flex-col min-h-screen bg-background transition-colors">
      <Header />

      <div className="flex flex-col items-center justify-center gap-6 flex-1 px-4 pt-5">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>

      <Footer />
    </main>
  );
}
