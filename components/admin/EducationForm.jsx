'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EducationForm({ education, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        institution: { tr: '', en: '' },
        degree: { tr: '', en: '' },
        field: { tr: '', en: '' },
        startDate: '',
        endDate: '',
        description: { tr: '', en: '' }
    });

    useEffect(() => {
        if (education) {
            setFormData(education);
        }
    }, [education]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            id: education ? education.id : Date.now().toString(),
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
                {education ? 'Eğitimi Düzenle' : 'Yeni Eğitim Ekle'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Institution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Kurum (TR)</label>
                        <input
                            type="text"
                            name="institution.tr"
                            value={formData.institution.tr}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Kurum (EN)</label>
                        <input
                            type="text"
                            name="institution.en"
                            value={formData.institution.en}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                </div>

                {/* Degree & Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Derece (TR)</label>
                        <input
                            type="text"
                            name="degree.tr"
                            value={formData.degree.tr}
                            onChange={handleChange}
                            placeholder="Lisans, Yüksek Lisans..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Derece (EN)</label>
                        <input
                            type="text"
                            name="degree.en"
                            value={formData.degree.en}
                            onChange={handleChange}
                            placeholder="Bachelor's, Master's..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Bölüm/Alan (TR)</label>
                        <input
                            type="text"
                            name="field.tr"
                            value={formData.field.tr}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Bölüm/Alan (EN)</label>
                        <input
                            type="text"
                            name="field.en"
                            value={formData.field.en}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Başlangıç Tarihi</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Bitiş Tarihi</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Açıklama (TR)</label>
                        <textarea
                            name="description.tr"
                            value={formData.description.tr}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Açıklama (EN)</label>
                        <textarea
                            name="description.en"
                            value={formData.description.en}
                            onChange={handleChange}
                            rows="3"
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
