'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { PROTECTED_ROUTES } from '@/features/auth/constants/routes';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="container h-full">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-icons text-blue-600">assignment</span>
            <span className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Task Pilot
            </span>
          </Link>
          
          {user && (
            <nav className="flex items-center gap-6">
              <Link 
                href={PROTECTED_ROUTES.TASKS}
                className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <span className="material-icons text-[14px]">list_alt</span>
                Görevler
              </Link>
              <Link 
                href={PROTECTED_ROUTES.PROFILE}
                className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <span className="material-icons text-[14px]">person</span>
                Profil
              </Link>
              <Link 
                href={PROTECTED_ROUTES.SETTINGS}
                className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <span className="material-icons text-[14px]">settings</span>
                Ayarlar
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="material-icons text-[14px] text-blue-600">person</span>
                </div>
                <span className="text-xs text-gray-600">{user.email?.split('@')[0]}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => logout()} 
                className="text-xs h-7 text-gray-600 hover:text-red-600 hover:bg-red-50 flex items-center gap-1"
              >
                <span className="material-icons text-[14px]">logout</span>
                Çıkış Yap
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 