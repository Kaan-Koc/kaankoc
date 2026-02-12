import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export const runtime = 'edge';

export async function POST(request) {
    try {
        const token = request.cookies.get('admin_token');

        if (!token?.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let env = {};
        try {
            const { getRequestContext } = await import('@cloudflare/next-on-pages');
            const ctx = getRequestContext();
            env = ctx?.env || {};
        } catch (e) {
            env = process.env;
        }
        const JWT_SECRET = env.JWT_SECRET || process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        // Verify current token
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(token.value, secret);
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Increment token version in KV storage
        const tokenVersionKV = env.TOKEN_VERSION;

        if (tokenVersionKV) {
            const currentVersion = await tokenVersionKV.get('current_version');
            const newVersion = (parseInt(currentVersion || '0') + 1).toString();
            await tokenVersionKV.put('current_version', newVersion);

            // Log the invalidation
            const adminLogsKV = env.ADMIN_LOGS;
            if (adminLogsKV) {
                const logEntry = JSON.stringify({
                    timestamp: new Date().toISOString(),
                    action: 'sessions_invalidated',
                    newVersion
                });
                await adminLogsKV.put(`log_${Date.now()}_invalidate`, logEntry, { expirationTtl: 604800 });
            }

            return NextResponse.json({
                success: true,
                message: 'All sessions invalidated',
                newVersion
            });
        }

        // Fallback: if no KV, just clear current session
        const response = NextResponse.json({
            success: true,
            message: 'Session cleared (KV not available)'
        });
        response.cookies.delete('admin_token');
        return response;

    } catch (error) {
        console.error('Invalidate sessions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
