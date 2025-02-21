import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';
import { AUTH_ROUTES, PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';

export const useAuthRedirect = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = pathname?.split('/(features)').pop() || pathname;

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(normalizedPath as any);
    const isProtectedRoute = Object.values(PROTECTED_ROUTES).includes(normalizedPath as any);

    if (!user && isProtectedRoute) {
      router.push(AUTH_ROUTES.LOGIN);
    }

    if (user && isPublicRoute) {
      router.push(PROTECTED_ROUTES.TASKS);
    }
  }, [user, loading, normalizedPath, router]);

  return { isAuthenticated: !!user, loading };
}; 