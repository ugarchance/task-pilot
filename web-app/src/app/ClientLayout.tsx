'use client';

import StoreProvider from './StoreProvider';
import { Toaster } from 'sonner';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { usePathname } from 'next/navigation';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/(auth)') || 
                    pathname?.includes('/login') || 
                    pathname?.includes('/register') ||
                    pathname?.includes('/verify-email');

  return (
    <StoreProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          {!isAuthPage && (
            <header className="h-10 border-b bg-background/95 backdrop-blur">
              <Header />
            </header>
          )}
          <main className="flex-1 h-[calc(100vh-5rem)]">
            {children}
          </main>
          {!isAuthPage && (
            <footer className="h-10 border-t bg-white">
              <Footer />
            </footer>
          )}
        </div>
      </AuthProvider>
      <Toaster position="top-right" richColors />
    </StoreProvider>
  );
} 