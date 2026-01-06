import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        const data = await env.PORTFOLIO_DATA.get('certificates');
        return NextResponse.json(data ? JSON.parse(data) : []);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read certificates' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { env } = getRequestContext();
        const certificates = await request.json();
        await env.PORTFOLIO_DATA.put('certificates', JSON.stringify(certificates));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save certificates' }, { status: 500 });
    }
}
