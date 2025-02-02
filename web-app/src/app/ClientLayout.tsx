'use client';

import StoreProvider from './StoreProvider';
import { Toaster } from 'sonner';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <StoreProvider>
      <AuthProvider>
        <Header />
        <main className="flex-1 min-h-0">
          {children}
        </main>
        <Footer />
      </AuthProvider>
      <Toaster position="top-right" richColors />
    </StoreProvider>
  );
} 