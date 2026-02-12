import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

export const runtime = 'edge';

export async function POST(request) {
    try {
        // Verify admin authentication
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
        let currentIp;
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token.value, secret);
            currentIp = payload.ip;
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Get passwords from request
        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({
                error: 'Current password and new password are required'
            }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({
                error: 'New password must be at least 8 characters'
            }, { status: 400 });
        }

        // Verify current password
        const ADMIN_PASSWORD_HASH = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
        const isCurrentValid = await bcrypt.compare(currentPassword, ADMIN_PASSWORD_HASH);

        if (!isCurrentValid) {
            return NextResponse.json({
                error: 'Current password is incorrect'
            }, { status: 401 });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Get or increment token version
        const tokenVersionKV = env.TOKEN_VERSION;
        let newVersion = '1';

        if (tokenVersionKV) {
            const currentVersion = await tokenVersionKV.get('current_version');
            newVersion = (parseInt(currentVersion || '0') + 1).toString();
            await tokenVersionKV.put('current_version', newVersion);
        }

        // Log password change
        const adminLogsKV = env.ADMIN_LOGS;
        if (adminLogsKV) {
            const logEntry = JSON.stringify({
                timestamp: new Date().toISOString(),
                ip: currentIp,
                action: 'password_changed',
                tokenVersion: newVersion
            });
            await adminLogsKV.put(`log_${Date.now()}_password_change`, logEntry, { expirationTtl: 604800 });
        }

        // Generate new JWT with new version
        const secret = new TextEncoder().encode(JWT_SECRET);
        const newToken = await new SignJWT({
            admin: true,
            ip: currentIp,
            version: newVersion
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secret);

        const response = NextResponse.json({
            success: true,
            message: 'Password changed successfully. All other sessions have been invalidated.',
            newPasswordHash // You need to manually update this in your environment variables
        });

        // Set new JWT cookie
        response.cookies.set('admin_token', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24
        });

        return response;

    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
