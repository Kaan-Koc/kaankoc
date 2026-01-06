import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        const data = await env.PORTFOLIO_DATA.get('messages');
        return NextResponse.json(data ? JSON.parse(data) : []);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { env } = getRequestContext();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const dataStr = await env.PORTFOLIO_DATA.get('messages');
        let data = dataStr ? JSON.parse(dataStr) : [];

        data = data.filter(item => item.id !== id);

        await env.PORTFOLIO_DATA.put('messages', JSON.stringify(data));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
