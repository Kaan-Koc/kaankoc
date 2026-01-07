import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { Resend } from 'resend';

// export const runtime = 'edge'; // Disabled for stability

// POST /api/contact - Submit new message
export async function POST(request) {
    try {
        const ctx = getRequestContext();
        const env = ctx?.env;

        if (!env || !env.PORTFOLIO_DATA) {
            console.warn('KV namespace not found. Running in local/mock mode?');
            // Optionally return a mock success or specific error if critical
        }

        const body = await request.json();

        // Validation
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { error: 'Ad, e-posta ve mesaj alanları zorunludur.' },
                { status: 400 }
            );
        }

        // 1. Save to KV (Backup & Admin Panel)
        const existingData = await env.PORTFOLIO_DATA.get('messages');
        const messages = existingData ? JSON.parse(existingData) : [];

        const newMessage = {
            id: Date.now().toString(),
            ...body,
            createdAt: new Date().toISOString(),
            read: false
        };

        messages.unshift(newMessage); // Add to beginning
        await env.PORTFOLIO_DATA.put('messages', JSON.stringify(messages));

        // 2. Send Email via Resend
        if (env.RESEND_API_KEY) {
            const resend = new Resend(env.RESEND_API_KEY);

            await resend.emails.send({
                from: 'Portfolio Contact <onboarding@resend.dev>', // Default testing sender
                to: 'kaankociletisim@gmail.com', // User's email
                subject: `Yeni İletişim Mesajı: ${body.name}`,
                html: `
                    <h3>Yeni Mesaj Var!</h3>
                    <p><strong>Kimden:</strong> ${body.name} (${body.email})</p>
                    <p><strong>Mesaj:</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
                        ${body.message}
                    </blockquote>
                    <p><small>Bu mesaj web sitenizden gönderildi.</small></p>
                `
            });
        } else {
            console.warn('RESEND_API_KEY is missing, skipping email.');
        }

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error('Error processing contact form:', error);
        return NextResponse.json(
            { error: 'Mesaj kaydedilirken bir hata oluştu.' },
            { status: 500 }
        );
    }
}
