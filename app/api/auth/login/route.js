import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request) {
    try {
        const { password } = await request.json();

        // Get password securely from Cloudflare environment
        const ctx = getRequestContext();
        const env = ctx?.env || {}; // Fallback for safety

        // Priority: Cloudflare Env -> Process Env -> Fail
        const ADMIN_PASSWORD = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

        if (!ADMIN_PASSWORD) {
            console.error('SERVER ERROR: ADMIN_PASSWORD is not set in environment variables.');
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

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
