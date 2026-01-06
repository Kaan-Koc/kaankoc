import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CV_DIR = path.join(process.cwd(), 'public', 'cv');

// Helper to ensure directory exists
async function ensureDir() {
    try {
        await fs.access(CV_DIR);
    } catch {
        await fs.mkdir(CV_DIR, { recursive: true });
    }
}

export async function GET() {
    await ensureDir();
    try {
        const files = await fs.readdir(CV_DIR);
        const cvFiles = await Promise.all(
            files.map(async (file) => {
                const stats = await fs.stat(path.join(CV_DIR, file));
                return {
                    name: file,
                    url: `/cv/${file}`,
                    createdAt: stats.birthtime,
                    size: stats.size
                };
            })
        );

        // Sort by date (newest first)
        cvFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return NextResponse.json(cvFiles);
    } catch (error) {
        console.error('Error listing CVs:', error);
        return NextResponse.json({ error: 'Dosyalar listelenemedi' }, { status: 500 });
    }
}

export async function POST(request) {
    await ensureDir();
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'Dosya yüklenmedi.' },
                { status: 400 }
            );
        }

        // Check if file is PDF
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Sadece PDF dosyaları yüklenebilir.' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Clean filename: remove spaces, special chars, ensure unique if needed
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = path.join(CV_DIR, safeName);

        // Write file (overwrite if exists)
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            message: 'CV başarıyla yüklendi.',
            data: {
                name: safeName,
                url: `/cv/${safeName}`
            }
        });

    } catch (error) {
        console.error('CV upload error:', error);
        return NextResponse.json(
            { error: 'Dosya yüklenirken bir hata oluştu.' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json({ error: 'Dosya adı gerekli' }, { status: 400 });
        }

        const filePath = path.join(CV_DIR, filename);
        await fs.unlink(filePath);

        return NextResponse.json({ success: true, message: 'Dosya silindi' });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Dosya silinemedi' }, { status: 500 });
    }
}
