'use client';

import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useEffect } from 'react';

// Configure worker locally to ensure it only runs when this component loads
if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export default function PDFThumbnail({ url, width }) {
    return (
        <Document
            file={url}
            loading={
                <div className="flex flex-col items-center justify-center opacity-50">
                    <span className="text-4xl mb-2">📄</span>
                    <span className="text-xs">Yükleniyor...</span>
                </div>
            }
            error={
                <div className="flex flex-col items-center justify-center opacity-50 text-red-500">
                    <span className="text-4xl mb-2">⚠️</span>
                    <span className="text-xs">Önizleme Hatası</span>
                </div>
            }
            className="w-full h-full flex items-center justify-center"
        >
            <Page
                pageNumber={1}
                width={width ? width - 8 : 300}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-sm"
            />
        </Document>
    );
}
