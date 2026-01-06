import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// POST /api/contact - Submit new message
export async function POST(request) {
    try {
        const { env } = getRequestContext();
        const body = await request.json();

        // Validation
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { error: 'Ad, e-posta ve mesaj alanları zorunludur.' },
                { status: 400 }
            );
        }

        // Get existing messages
        const existingData = await env.PORTFOLIO_DATA.get('messages');
        const messages = existingData ? JSON.parse(existingData) : [];

        // Add new message
        const newMessage = {
            id: Date.now().toString(),
            ...body,
            createdAt: new Date().toISOString(),
            read: false
        };

        messages.unshift(newMessage); // Add to beginning

        // Save to KV
        await env.PORTFOLIO_DATA.put('messages', JSON.stringify(messages));

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error('Error saving message:', error);
        return NextResponse.json(
            { error: 'Mesaj kaydedilirken bir hata oluştu.' },
            { status: 500 }
        );
    }
}
