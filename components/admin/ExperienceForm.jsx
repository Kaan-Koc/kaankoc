'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ExperienceForm({ experience, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        company: { tr: '', en: '' },
        position: { tr: '', en: '' },
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: { tr: '', en: '' } // Using string with newlines for array management
    });

    useEffect(() => {
        if (experience) {
            setFormData({
                ...experience,
                description: {
                    tr: Array.isArray(experience.description.tr) ? experience.description.tr.join('\n') : experience.description.tr,
                    en: Array.isArray(experience.description.en) ? experience.description.en.join('\n') : experience.description.en
                }
            });
        }
    }, [experience]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            description: {
                tr: formData.description.tr.split('\n').filter(Boolean),
                en: formData.description.en.split('\n').filter(Boolean)
            },
            id: experience ? experience.id : Date.now().toString(),
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
                {experience ? 'Deneyimi Düzenle' : 'Yeni Deneyim Ekle'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Şirket (TR)</label>
                        <input
                            type="text"
                            name="company.tr"
                            value={formData.company.tr}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Şirket (EN)</label>
                        <input
                            type="text"
                            name="company.en"
                            value={formData.company.en}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                </div>

                {/* Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Pozisyon (TR)</label>
                        <input
                            type="text"
                            name="position.tr"
                            value={formData.position.tr}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Pozisyon (EN)</label>
                        <input
                            type="text"
                            name="position.en"
                            value={formData.position.en}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                </div>

                {/* Location & Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Konum</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
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
                            value={formData.endDate || ''}
                            onChange={handleChange}
                            disabled={formData.current}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="current"
                        checked={formData.current}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-yeditepe focus:ring-yeditepe-400"
                    />
                    <label className="text-white/80">Halen Buradayım</label>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Açıklama (TR) - Her madde yeni satır</label>
                        <textarea
                            name="description.tr"
                            value={formData.description.tr}
                            onChange={handleChange}
                            rows="5"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Açıklama (EN) - Her madde yeni satır</label>
                        <textarea
                            name="description.en"
                            value={formData.description.en}
                            onChange={handleChange}
                            rows="5"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
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
