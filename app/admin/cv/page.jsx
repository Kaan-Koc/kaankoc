'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNav from '@/components/admin/AdminNav';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminCV() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const res = await fetch('/api/admin/cv');
            if (res.ok) {
                const data = await res.json();
                setFiles(data);
            }
        } catch (error) {
            console.error('Error fetching CVs:', error);
        }
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            setMessage({ type: 'error', text: 'Sadece PDF dosyaları yüklenebilir.' });
            return;
        }

        await handleUpload(selectedFile);
    };

    const handleUpload = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/cv', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'CV başarıyla yüklendi!' });
                fetchFiles(); // Refresh list
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Yükleme sırasında bir hata oluştu.' });
        } finally {
            setUploading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`/api/admin/cv?filename=${deleteId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setFiles(files.filter(f => f.name !== deleteId));
                setMessage({ type: 'success', text: 'Dosya silindi.' });
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Silme işlemi başarısız oldu.' });
        } finally {
            setDeleteId(null);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yeditepe via-yeditepe-dark to-black">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-yeditepe-light rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>
            </div>

            <div className="relative z-10">
                <AdminNav title="CV Yönetimi" icon="📄" />

                <div className="max-w-4xl mx-auto px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-xl border border-white/20"
                    >
                        <h1 className="text-3xl font-anton text-white mb-8 flex items-center gap-2">
                            <span>📄</span> CV Yönetimi
                        </h1>

                        {/* Upload Zone */}
                        <div className="mb-12">
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-yeditepe-light hover:bg-white/5 transition-all relative group">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={uploading}
                                />
                                <div className="space-y-4">
                                    <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">📤</div>
                                    <div>
                                        <p className="text-xl font-medium text-white">
                                            {uploading ? 'Yükleniyor...' : 'PDF Dosyasını Buraya Sürükleyin'}
                                        </p>
                                        <p className="text-white/60 text-sm mt-1">veya seçmek için tıklayın</p>
                                    </div>
                                </div>
                            </div>

                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-4 p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                                        }`}
                                >
                                    {message.text}
                                </motion.div>
                            )}
                        </div>

                        {/* File List */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white mb-4">Yüklü Dosyalar</h2>
                            <AnimatePresence>
                                {files.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-8 text-white/40"
                                    >
                                        Henüz hiç CV yüklenmemiş.
                                    </motion.div>
                                ) : (
                                    files.map((file) => (
                                        <motion.div
                                            key={file.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="glass p-4 rounded-lg flex items-center justify-between group hover:bg-white/10 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-200">
                                                    PDF
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{file.name}</p>
                                                    <p className="text-white/40 text-sm">
                                                        {new Date(file.createdAt).toLocaleDateString()} • {(file.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors"
                                                    title="Görüntüle"
                                                >
                                                    👁️
                                                </a>
                                                <button
                                                    onClick={() => setDeleteId(file.name)}
                                                    className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="CV'yi Sil"
                message="Bu dosyayı silmek istediğinizden emin misiniz?"
            />
        </div>
    );
}
