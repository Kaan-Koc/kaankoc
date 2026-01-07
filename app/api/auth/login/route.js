import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export const runtime = 'edge';

export async function POST(request) {
    try {
        const { password } = await request.json();

        // Get environment and KV namespaces
        const ctx = getRequestContext();
        const env = ctx?.env || {};
        const rateLimitKV = env.RATE_LIMIT;
        const adminLogsKV = env.ADMIN_LOGS;

        // Get client IP for rate limiting
        const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';

        // Rate Limiting: Check attempts
        if (rateLimitKV) {
            const rateLimitKey = `login_attempts_${ip}`;
            const attempts = await rateLimitKV.get(rateLimitKey);
            const attemptCount = attempts ? parseInt(attempts) : 0;

            if (attemptCount >= 5) {
                // Log blocked attempt
                if (adminLogsKV) {
                    const logEntry = JSON.stringify({
                        timestamp: new Date().toISOString(),
                        ip,
                        action: 'login_blocked',
                        reason: 'rate_limit_exceeded'
                    });
                    await adminLogsKV.put(`log_${Date.now()}_${ip}`, logEntry, { expirationTtl: 604800 }); // 7 days
                }

                return NextResponse.json({
                    error: 'Too many failed attempts. Please try again in 15 minutes.'
                }, { status: 429 });
            }
        }

        // Get hashed password from environment
        const ADMIN_PASSWORD_HASH = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
        const JWT_SECRET = env.JWT_SECRET || process.env.JWT_SECRET;

        if (!ADMIN_PASSWORD_HASH || !JWT_SECRET) {
            console.error('SERVER ERROR: ADMIN_PASSWORD or JWT_SECRET not set');
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        // Verify password with bcrypt
        const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

        if (isValid) {
            // Generate JWT token
            const secret = new TextEncoder().encode(JWT_SECRET);
            const token = await new SignJWT({ admin: true, ip })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('24h')
                .sign(secret);

            const response = NextResponse.json({ success: true });

            // Set JWT as HttpOnly cookie
            response.cookies.set('admin_token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 // 24 hours
            });

            // Reset rate limit on success
            if (rateLimitKV) {
                await rateLimitKV.delete(`login_attempts_${ip}`);
            }

            // Log successful login
            if (adminLogsKV) {
                const logEntry = JSON.stringify({
                    timestamp: new Date().toISOString(),
                    ip,
                    action: 'login_success'
                });
                await adminLogsKV.put(`log_${Date.now()}_${ip}`, logEntry, { expirationTtl: 604800 });
            }

            return response;
        }

        // Failed login: increment rate limit counter
        if (rateLimitKV) {
            const rateLimitKey = `login_attempts_${ip}`;
            const attempts = await rateLimitKV.get(rateLimitKey);
            const attemptCount = attempts ? parseInt(attempts) : 0;
            await rateLimitKV.put(rateLimitKey, (attemptCount + 1).toString(), { expirationTtl: 900 }); // 15 minutes
        }

        // Log failed login
        if (adminLogsKV) {
            const logEntry = JSON.stringify({
                timestamp: new Date().toISOString(),
                ip,
                action: 'login_failed'
            });
            await adminLogsKV.put(`log_${Date.now()}_${ip}`, logEntry, { expirationTtl: 604800 });
        }

        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
