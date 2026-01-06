'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectForm({ project, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: { tr: '', en: '' },
        description: { tr: '', en: '' },
        image: '',
        technologies: '', // Will handle as comma-separated string
        demoUrl: '',
        githubUrl: '',
        featured: false,
        order: 0,
    });

    useEffect(() => {
        if (project) {
            setFormData({
                ...project,
                technologies: project.technologies ? project.technologies.join(', ') : '',
            });
        }
    }, [project]);

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
            technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
            order: parseInt(formData.order) || 0,
            id: project ? project.id : Date.now().toString(),
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
                {project ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Başlık (TR)</label>
                        <input
                            type="text"
                            name="title.tr"
                            value={formData.title.tr}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Başlık (EN)</label>
                        <input
                            type="text"
                            name="title.en"
                            value={formData.title.en}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
                        />
                    </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Açıklama (TR)</label>
                        <textarea
                            name="description.tr"
                            value={formData.description.tr}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                            required
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
                            required
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-white/80 mb-2">Görsel Yolu (örn: /images/projects/1.jpg)</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                        />
                    </div>

                    <div>
                        <label className="block text-white/80 mb-2">Teknolojiler (Virgülle ayırın)</label>
                        <input
                            type="text"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            placeholder="React, Next.js, Tailwind..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                        />
                    </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 mb-2">Demo URL</label>
                        <input
                            type="url"
                            name="demoUrl"
                            value={formData.demoUrl}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">GitHub URL</label>
                        <input
                            type="url"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yeditepe-400"
                        />
                    </div>
                </div>

                {/* Meta */}
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-white/10 bg-white/5 text-yeditepe focus:ring-yeditepe-400"
                        />
                        <label className="text-white/80">Öne Çıkan</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-white/80">Sıra:</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none"
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
