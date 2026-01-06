'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import EducationForm from '@/components/admin/EducationForm';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function EducationAdmin() {
    const router = useRouter();
    const [educationList, setEducationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEducation, setCurrentEducation] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchEducation();
    }, [router]);

    const fetchEducation = async () => {
        const res = await fetch('/api/admin/education');
        const data = await res.json();
        setEducationList(data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
        setLoading(false);
    };

    const handleSave = async (data) => {
        let updatedList;
        if (currentEducation) {
            updatedList = educationList.map(item => item.id === data.id ? data : item);
        } else {
            updatedList = [data, ...educationList];
        }

        updatedList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        await fetch('/api/admin/education', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList),
        });

        setEducationList(updatedList);
        setIsEditing(false);
        setCurrentEducation(null);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const updated = educationList.filter(p => p.id !== deleteId);
        await fetch('/api/admin/education', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
        });
        setEducationList(updated);
        setDeleteId(null);
    };

    const startEdit = (item) => {
        setCurrentEducation(item);
        setIsEditing(true);
    };

    const startNew = () => {
        setCurrentEducation(null);
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
                    <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yeditepe rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>
            </div>

            <div className="relative z-10 w-full">
                {/* Navigation */}
                <nav className="glass border-b border-white/10 mb-8">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-anton text-white flex items-center gap-2">
                            <span>🎓</span> Eğitim
                        </h1>
                        <div className="flex gap-4">
                            <button
                                onClick={startNew}
                                className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-all shadow-lg backdrop-blur-sm"
                            >
                                + Yeni Eğitim
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
                            <EducationForm
                                key="form"
                                education={currentEducation}
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
                                {educationList.map((edu, index) => (
                                    <motion.div
                                        key={edu.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass p-6 rounded-xl hover:bg-white/5 transition-all group"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-semibold text-white">
                                                        {edu.institution.tr}
                                                    </h3>
                                                </div>
                                                <p className="text-yeditepe-300 font-medium text-lg mb-1">{edu.degree.tr} - {edu.field.tr}</p>
                                                <p className="text-white/50 text-sm mb-4">
                                                    {edu.startDate} - {edu.endDate}
                                                </p>
                                                <p className="text-white/70">{edu.description.tr}</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(edu)}
                                                    className="px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 transition-all backdrop-blur-sm"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(edu.id)}
                                                    className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all backdrop-blur-sm"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {educationList.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-20"
                                    >
                                        <div className="text-6xl mb-4">📚</div>
                                        <p className="text-white/60 text-lg">Henüz eğitim eklenmemiş</p>
                                        <button
                                            onClick={startNew}
                                            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                                        >
                                            İlk Eğitimi Ekle
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
                title="Eğitimi Sil"
                message="Bu eğitimi silmek istediğinizden emin misiniz?"
            />
        </div>
    );
}
