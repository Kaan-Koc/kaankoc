'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CertificateForm({ certificate, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        issuer: '',
        issueDate: '',
        credentialUrl: '',
        logo: '',
        order: 0
    });

    useEffect(() => {
        if (certificate) {
            setFormData(certificate);
        }
    }, [certificate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            order: parseInt(formData.order) || 0,
            id: certificate ? certificate.id : Date.now().toString(),
        };
        onSave(submissionData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-light p-6 rounded-xl border border-white/20"
        >
            <h2 className="text-2xl font-anton text-white mb-6">
                {certificate ? 'Sertifikayı Düzenle' : 'Yeni Sertifika Ekle'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Issuer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Sertifika Adı</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Veren Kurum</label>
                        <input
                            type="text"
                            name="issuer"
                            value={formData.issuer}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                </div>

                {/* Date & URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Veriliş Tarihi</label>
                        <input
                            type="date"
                            name="issueDate"
                            value={formData.issueDate}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Sertifika URL</label>
                        <input
                            type="url"
                            name="credentialUrl"
                            value={formData.credentialUrl}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                        />
                    </div>
                </div>

                {/* Logo & Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Logo Yolu (örn: /images/certificates/google.svg)</label>
                        <input
                            type="text"
                            name="logo"
                            value={formData.logo}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Sıra</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-yeditepe hover:bg-yeditepe-light text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        Kaydet
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
