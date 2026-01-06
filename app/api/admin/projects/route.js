import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Get projects
export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'projects.json');
        const data = await fs.readFile(filePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
    }
}

// Update projects
export async function POST(request) {
    try {
        const projects = await request.json();
        const filePath = path.join(process.cwd(), 'data', 'projects.json');
        await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save projects' }, { status: 500 });
    }
}
