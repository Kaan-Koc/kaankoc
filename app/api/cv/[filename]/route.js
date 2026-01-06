import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request, { params }) {
    try {
        const { env } = getRequestContext();
        const { filename } = params;

        if (!filename) {
            return new NextResponse('Filename required', { status: 400 });
        }

        const file = await env.PORTFOLIO_DATA.get(`file:${filename}`, { type: 'arrayBuffer' });

        if (!file) {
            return new NextResponse('File not found', { status: 404 });
        }

        return new NextResponse(file, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${filename}"`
            }
        });
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}
