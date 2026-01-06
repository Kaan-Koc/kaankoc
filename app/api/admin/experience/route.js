import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        const data = await env.PORTFOLIO_DATA.get('experience');
        return NextResponse.json(data ? JSON.parse(data) : []);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read experience' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { env } = getRequestContext();
        const experience = await request.json();
        await env.PORTFOLIO_DATA.put('experience', JSON.stringify(experience));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save experience' }, { status: 500 });
    }
}
