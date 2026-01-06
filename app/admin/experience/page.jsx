'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ExperienceForm from '@/components/admin/ExperienceForm';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function ExperienceAdmin() {
    const router = useRouter();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExperience, setCurrentExperience] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchExperiences();
    }, [router]);

    const fetchExperiences = async () => {
        const res = await fetch('/api/admin/experience');
        const data = await res.json();
        setExperiences(data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
        setLoading(false);
    };

    const handleSave = async (data) => {
        let updatedList;
        if (currentExperience) {
            updatedList = experiences.map(item => item.id === data.id ? data : item);
        } else {
            updatedList = [data, ...experiences];
        }

        updatedList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        await fetch('/api/admin/experience', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList),
        });

        setExperiences(updatedList);
        setIsEditing(false);
        setCurrentExperience(null);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const updated = experiences.filter(p => p.id !== deleteId);
        await fetch('/api/admin/experience', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
        });
        setExperiences(updated);
        setDeleteId(null);
    };

    const startEdit = (item) => {
        setCurrentExperience(item);
        setIsEditing(true);
    };

    const startNew = () => {
        setCurrentExperience(null);
        setIsEditing(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yeditepe via-yeditepe-dark to-black flex items-center justify-center">
                <div className="text-white text-xl">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yeditepe via-yeditepe-dark to-black">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>
            </div>

            <div className="relative z-10 w-full">
                {/* Navigation */}
                <nav className="glass border-b border-white/10 mb-8">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-anton text-white flex items-center gap-2">
                            <span>🚀</span> Deneyim
                        </h1>
                        <div className="flex gap-4">
                            <button
                                onClick={startNew}
                                className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-all shadow-lg backdrop-blur-sm"
                            >
                                + Yeni Deneyim
                            </button>
                            <Link
                                href="/admin/dashboard"
                                className="px-4 py-2 glass-light text-white/90 rounded-lg hover:bg-white/20 transition-all"
                            >
                                ← Dashboard
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 pb-12">
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <ExperienceForm
                                key="form"
                                experience={currentExperience}
                                onSave={handleSave}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid gap-6"
                            >
                                {experiences.map((exp, index) => (
                                    <motion.div
                                        key={exp.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass p-6 rounded-xl hover:bg-white/5 transition-all group"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-semibold text-white">
                                                        {exp.position.tr}
                                                    </h3>
                                                    {exp.current && (
                                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-200 text-xs rounded-full border border-green-500/30">
                                                            Mevcut
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-yeditepe-300 font-medium mb-1">{exp.company.tr}</p>
                                                <p className="text-white/50 text-sm mb-4">
                                                    {exp.startDate} - {exp.current ? 'Günümüz' : exp.endDate} | {exp.location}
                                                </p>

                                                <ul className="list-disc list-inside text-white/70 space-y-1">
                                                    {Array.isArray(exp.description.tr) && exp.description.tr.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(exp)}
                                                    className="px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 transition-all backdrop-blur-sm"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(exp.id)}
                                                    className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all backdrop-blur-sm"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {experiences.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-20"
                                    >
                                        <div className="text-6xl mb-4">📄</div>
                                        <p className="text-white/60 text-lg">Henüz deneyim eklenmemiş</p>
                                        <button
                                            onClick={startNew}
                                            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                                        >
                                            İlk Deneyimi Ekle
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Deneyimi Sil"
                message="Bu deneyimi silmek istediğinizden emin misiniz?"
            />
        </div>
    );
}
