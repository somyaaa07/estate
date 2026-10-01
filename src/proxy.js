import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function proxy(req) {
  const { pathname } = req.nextUrl;

<<<<<<< HEAD
  // Admin login public hai
  if (pathname === '/admin/login') {
=======
  // Admin login + first-time signup public hain
  // (signup API khud check karti hai ki admin pehle se hai ya nahi)
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
>>>>>>> origin/main
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdmin = token?.role?.toLowerCase() === 'admin';

  if (!isAdmin) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
<<<<<<< HEAD
  matcher: ['/admin/:path*', '/dashboard/list-property/:path*'],
};
=======
  matcher: ['/admin/:path*'],
};
>>>>>>> origin/main
