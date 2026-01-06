import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { password } = await request.json();

        // Check against environment variable
        // Fallback is ONLY for development/demo if .env is missing, but should be removed in prod
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Yedi39tepe59skin.';

        if (password === ADMIN_PASSWORD) {
            const response = NextResponse.json({ success: true });

            // Set HttpOnly cookie
            response.cookies.set('admin_token', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return response;
        }

        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
