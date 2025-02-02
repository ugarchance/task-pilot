'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/tasks');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 