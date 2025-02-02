'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { PROTECTED_ROUTES, AUTH_ROUTES } from '@/features/auth/constants/routes';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Task Pilot</span>
        </Link>
        <nav className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-6 text-sm font-medium">
            {user ? (
              <>
                <Link href={PROTECTED_ROUTES.TASKS}>Görevler</Link>
                <Link href={PROTECTED_ROUTES.PROFILE}>Profil</Link>
                <Link href={PROTECTED_ROUTES.SETTINGS}>Ayarlar</Link>
              </>
            ) : null}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Button variant="ghost" onClick={() => logout()}>
                Çıkış Yap
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href={AUTH_ROUTES.LOGIN}>Giriş Yap</Link>
                </Button>
                <Button asChild>
                  <Link href={AUTH_ROUTES.REGISTER}>Kayıt Ol</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
} 