import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PUBLIC_ROUTES } from '@/features/auth/constants/routes';
import { PROTECTED_ROUTES } from '@/features/auth/constants/routes';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname as any);
  
  // Auth token kontrolü - Firebase Hosting için cookie adı '__session' olmalı
  const token = request.cookies.get('__session');
  
  // Kullanıcı giriş yapmamışsa ve tasks sayfasına erişmeye çalışıyorsa
  // doğrudan login sayfasına yönlendir
  if (!token && (pathname === '/tasks' || pathname.startsWith('/tasks/'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Public route'lara erişim kontrolü
  if (isPublicRoute) {
    if (token) {
      // Kullanıcı giriş yapmışsa ve public route'a erişmeye çalışıyorsa tasks sayfasına yönlendir
      return NextResponse.redirect(new URL('/tasks', request.url));
    }
    return NextResponse.next();
  }

  // Ana sayfa kontrolü
  if (pathname === '/') {
    if (token) {
      // Kullanıcı giriş yapmışsa ve ana sayfaya erişmeye çalışıyorsa tasks sayfasına yönlendir
      return NextResponse.redirect(new URL('/tasks', request.url));
    } else {
      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protected route'lara erişim kontrolü - genel kontrol
  if (!token && Object.values(PROTECTED_ROUTES).some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 