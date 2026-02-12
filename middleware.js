import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Redirect .pages.dev to main domain
    const host = request.headers.get('host');
    if (host && host.includes('.pages.dev')) {
        return NextResponse.redirect(new URL(`https://kaankoc.net${pathname}${request.nextUrl.search}`, request.url));
    }

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
    const isLoginPage = pathname === '/admin';
    const isProtected = pathname.startsWith('/admin/') || pathname.startsWith('/api/admin');

    // Verify JWT token for protected routes
    let isAuth = false;
    if (token?.value) {
        try {
            // Get JWT_SECRET from environment (will be available in Edge runtime)
            const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
            const secret = new TextEncoder().encode(JWT_SECRET);

            const { payload } = await jwtVerify(token.value, secret);

            // Check if token version matches current version (if KV available)
            let versionValid = true;
            if (process.env.TOKEN_VERSION_KV) {
                try {
                    const { getRequestContext } = await import('@cloudflare/next-on-pages');
                    const ctx = getRequestContext();
                    const tokenVersionKV = ctx?.env?.TOKEN_VERSION;

                    if (tokenVersionKV) {
                        const currentVersion = await tokenVersionKV.get('current_version') || '1';
                        const tokenVersion = payload.version || '1';
                        versionValid = tokenVersion === currentVersion;
                    }
                } catch (e) {
                    // If KV not available, skip version check
                }
            }

            isAuth = payload.admin === true && versionValid;
        } catch (error) {
            // Invalid or expired token
            isAuth = false;
        }
    }

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
