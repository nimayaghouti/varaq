import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';

import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth(req => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  const isAdmin = req.auth?.user?.role === 'ADMIN';

  const isAuthRoute =
    nextUrl.pathname.startsWith('/login') ||
    nextUrl.pathname.startsWith('/register');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isUserRoute =
    nextUrl.pathname.startsWith('/profile') ||
    nextUrl.pathname.startsWith('/checkout');

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  if ((isAdminRoute || isUserRoute) && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`,
        nextUrl,
      ),
    );
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)'],
};
