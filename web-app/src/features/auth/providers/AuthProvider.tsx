'use client';

import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { Toaster } from 'sonner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Auth durumunu ve yönlendirmeleri kontrol et
  const { loading } = useAuthRedirect();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
} 