import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
    try {
        const ctx = getRequestContext();
        const env = ctx?.env || {};
        const adminLogsKV = env.ADMIN_LOGS;

        if (!adminLogsKV) {
            return NextResponse.json({ logs: [] });
        }

        // Get all logs (last 100)
        const list = await adminLogsKV.list({ limit: 100 });
        const logPromises = list.keys.map(async (key) => {
            const value = await adminLogsKV.get(key.name);
            return value ? JSON.parse(value) : null;
        });

        const logs = (await Promise.all(logPromises))
            .filter(log => log !== null)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 50); // Return last 50 logs

        return NextResponse.json({ logs });
    } catch (error) {
        console.error('Activity log error:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
