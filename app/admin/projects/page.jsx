'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectForm from '@/components/admin/ProjectForm';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function ProjectsAdmin() {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, [router]);

    const fetchProjects = async () => {
        const res = await fetch('/api/admin/projects');
        const data = await res.json();
        setProjects(data.sort((a, b) => a.order - b.order));
        setLoading(false);
    };

    const handleSave = async (projectData) => {
        let updatedProjects;
        if (currentProject) {
            updatedProjects = projects.map(p => p.id === projectData.id ? projectData : p);
        } else {
            updatedProjects = [...projects, projectData];
        }

        // Sort logic handled in backend usually, but JSON file needs simple sort
        updatedProjects.sort((a, b) => a.order - b.order);

        await fetch('/api/admin/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProjects),
        });

        setProjects(updatedProjects);
        setIsEditing(false);
        setCurrentProject(null);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const updated = projects.filter(p => p.id !== deleteId);
        await fetch('/api/admin/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
        });
        setProjects(updated);
        setDeleteId(null);
    };

    const startEdit = (project) => {
        setCurrentProject(project);
        setIsEditing(true);
    };

    const startNew = () => {
        setCurrentProject(null);
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
                    <div className="absolute top-0 left-0 w-96 h-96 bg-yeditepe-light rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Navigation */}
                <nav className="glass border-b border-white/10 mb-8">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-anton text-white flex items-center gap-2">
                            <span>💼</span> Projeler
                        </h1>
                        <div className="flex gap-4">
                            <button
                                onClick={startNew}
                                className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-all shadow-lg backdrop-blur-sm"
                            >
                                + Yeni Proje
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
                            <ProjectForm
                                key="form"
                                project={currentProject}
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
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass p-6 rounded-xl hover:bg-white/5 transition-all group"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-semibold text-white group-hover:text-white/90 transition-colors">
                                                        {project.title.tr}
                                                    </h3>
                                                    {project.featured && (
                                                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-200 text-xs rounded-full border border-yellow-500/30">
                                                            Öne Çıkan
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-white/70 mb-4 leading-relaxed">{project.description.tr}</p>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {project.technologies?.map((tech, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1 bg-white/10 text-white/90 text-sm rounded-lg backdrop-blur-sm"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(project)}
                                                    className="px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 transition-all backdrop-blur-sm"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(project.id)}
                                                    className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all backdrop-blur-sm"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {projects.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-20"
                                    >
                                        <div className="text-6xl mb-4">📁</div>
                                        <p className="text-white/60 text-lg">Henüz proje eklenmemiş</p>
                                        <button
                                            onClick={startNew}
                                            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                                        >
                                            İlk Projeyi Ekle
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
                title="Projeyi Sil"
                message="Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
            />
        </div>
    );
}
