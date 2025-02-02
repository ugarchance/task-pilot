import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PUBLIC_ROUTES } from '@/features/auth/constants/routes';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname as any);

  // Auth token kontrolü
  const token = request.cookies.get('auth-token');

  // Public route'lara erişim kontrolü
  if (isPublicRoute) {
    if (token) {
      return NextResponse.redirect(new URL('/tasks', request.url));
    }
    return NextResponse.next();
  }

  // Protected route'lara erişim kontrolü
  if (!token) {
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