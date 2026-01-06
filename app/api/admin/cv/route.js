import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        const metadataList = await env.PORTFOLIO_DATA.get('cv_files');
        const files = metadataList ? JSON.parse(metadataList) : [];
        return NextResponse.json(files);
    } catch (error) {
        return NextResponse.json({ error: 'Dosyalar listelenemedi' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { env } = getRequestContext();
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'Dosya yüklenmedi.' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Sadece PDF dosyaları yüklenebilir.' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

        // Save binary file to KV
        await env.PORTFOLIO_DATA.put(`file:${safeName}`, buffer, {
            metadata: { contentType: 'application/pdf' }
        });

        // Update metadata list
        const metadataListStr = await env.PORTFOLIO_DATA.get('cv_files');
        let files = metadataListStr ? JSON.parse(metadataListStr) : [];

        // Remove existing if overwriting
        files = files.filter(f => f.name !== safeName);

        files.unshift({
            name: safeName,
            url: `/api/cv/${safeName}`,
            createdAt: new Date().toISOString(),
            size: buffer.byteLength
        });

        await env.PORTFOLIO_DATA.put('cv_files', JSON.stringify(files));

        return NextResponse.json({
            success: true,
            message: 'CV başarıyla yüklendi.',
            data: files[0]
        });

    } catch (error) {
        console.error('CV upload error:', error);
        return NextResponse.json({ error: 'Dosya yüklenirken bir hata oluştu.' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { env } = getRequestContext();
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) return NextResponse.json({ error: 'Dosya adı gerekli' }, { status: 400 });

        // Delete file content
        await env.PORTFOLIO_DATA.delete(`file:${filename}`);

        // Update list
        const metadataListStr = await env.PORTFOLIO_DATA.get('cv_files');
        if (metadataListStr) {
            let files = JSON.parse(metadataListStr);
            files = files.filter(f => f.name !== filename);
            await env.PORTFOLIO_DATA.put('cv_files', JSON.stringify(files));
        }

        return NextResponse.json({ success: true, message: 'Dosya silindi' });
    } catch (error) {
        return NextResponse.json({ error: 'Dosya silinemedi' }, { status: 500 });
    }
}
