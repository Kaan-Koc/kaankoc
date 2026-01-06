import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'certificates.json');
        const data = await fs.readFile(filePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read certificates' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const certificates = await request.json();
        const filePath = path.join(process.cwd(), 'data', 'certificates.json');
        await fs.writeFile(filePath, JSON.stringify(certificates, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save certificates' }, { status: 500 });
    }
}
