import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Skip static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/cv') ||
        pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|pdf)$/i)
    ) {
        return NextResponse.next();
    }

    // Auth Check
    const token = request.cookies.get('admin_token');
    const isAuth = !!token;
    const isLoginPage = pathname === '/admin';
    const isProtected = pathname.startsWith('/admin/') || pathname.startsWith('/api/admin');

    // Redirect to dashboard if logged in and visiting login page
    if (isLoginPage && isAuth) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Protect admin routes
    if (isProtected && !isAuth) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Skip admin route from locale redirect (already handled above, but keeping for safety if it falls through)
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        return NextResponse.next();
    }

    // Check if pathname already has a locale
    const pathnameHasLocale = /^\/(tr|en)(\/|$)/.test(pathname);

    if (!pathnameHasLocale) {
        // Default to Turkish
        return NextResponse.redirect(new URL(`/tr${pathname}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|_vercel).*)'],
};
