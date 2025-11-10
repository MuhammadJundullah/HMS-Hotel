import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

  const isLoginPage = req.nextUrl.pathname === '/login';
  const isApiLogin = req.nextUrl.pathname === '/api/auth/login';

  if (!token) {
    // If no token and not on login page or api login, redirect to login
    if (!isLoginPage && !isApiLogin && !req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // Allow access to login page or api login if no token
    return NextResponse.next();
  }

  // If token exists and trying to access login page, redirect to home
  if (isLoginPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const { payload } = await jose.jwtVerify(token, secret);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.userId as string);
    requestHeaders.set('x-user-role', payload.role as string);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    console.error('JWT verification failed:', error);
    // If token is invalid, clear cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: ['/', '/api/rooms/:path*', '/api/auth/user', '/logs', '/api/logs', '/admin/users', '/api/users/:path*', '/login'],
};
