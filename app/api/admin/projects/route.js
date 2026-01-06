import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// Get projects
export async function GET() {
    try {
        const { env } = getRequestContext();
        const data = await env.PORTFOLIO_DATA.get('projects');
        return NextResponse.json(data ? JSON.parse(data) : []);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
    }
}

// Update projects
export async function POST(request) {
    try {
        const { env } = getRequestContext();
        const projects = await request.json();
        await env.PORTFOLIO_DATA.put('projects', JSON.stringify(projects));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save projects' }, { status: 500 });
    }
}
