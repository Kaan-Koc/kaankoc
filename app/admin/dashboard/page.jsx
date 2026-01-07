'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ projects: 0, experience: 0, education: 0, certificates: 0, messages: 0, cvs: 0 });

    useEffect(() => {


        // Fetch stats
        Promise.all([
            fetch('/api/admin/projects').then(r => r.json()),
            fetch('/api/admin/experience').then(r => r.json()),
            fetch('/api/admin/education').then(r => r.json()),
            fetch('/api/admin/certificates').then(r => r.json()),
            fetch('/api/admin/messages').then(r => r.json()),
            fetch('/api/admin/cv').then(r => r.json()),
        ]).then(([projects, experience, education, certificates, messages, cvs]) => {
            setStats({
                projects: projects.length || 0,
                experience: experience.length || 0,
                education: education.length || 0,
                certificates: certificates.length || 0,
                messages: messages.length || 0,
                cvs: cvs.length || 0,
            });
        });
    }, [router]);



    const cards = [
        { title: 'Mesajlar', count: stats.messages, href: '/admin/messages', icon: '✉️', color: 'from-pink-500 to-rose-500' },
        { title: 'Projeler', count: stats.projects, href: '/admin/projects', icon: '💼', color: 'from-blue-500 to-cyan-500' },
        { title: 'Deneyim', count: stats.experience, href: '/admin/experience', icon: '🏢', color: 'from-purple-500 to-pink-500' },
        { title: 'Eğitim', count: stats.education, href: '/admin/education', icon: '🎓', color: 'from-green-500 to-emerald-500' },
        { title: 'Sertifikalar', count: stats.certificates, href: '/admin/certificates', icon: '🏆', color: 'from-orange-500 to-red-500' },
        { title: 'CV Yönetimi', count: stats.cvs, href: '/admin/cv', icon: '📄', color: 'from-gray-500 to-slate-500' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yeditepe via-yeditepe-dark to-black">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-yeditepe-light rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yeditepe rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Navigation */}
                <AdminNav title="Kaan Koç - Admin Panel" isDashboard={true} />

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-anton text-white mb-10"
                    >
                        İçerik Yönetimi
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {cards.map((card, index) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <Link href={card.href} className="block">
                                    <div className="glass p-6 rounded-xl hover:bg-white/10 transition-all group">
                                        <div className={`text-5xl mb-4 transform group-hover:scale-110 transition-transform`}>
                                            {card.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 text-white">{card.title}</h3>
                                        <p className="text-4xl font-bold text-white mb-1">{card.count}</p>
                                        <p className="text-white/60 text-sm">öğe</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass p-8 rounded-xl border border-white/20"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                            <span>💡</span> Nasıl Kullanılır?
                        </h3>
                        <ul className="space-y-3 text-white/80">
                            <li className="flex items-start gap-2">
                                <span className="text-white/60">→</span>
                                Kartlara tıklayarak ilgili içerikleri yönetin
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-white/60">→</span>
                                Yeni içerik ekleyin veya mevcut içerikleri düzenleyin
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-white/60">→</span>
                                Değişiklikler otomatik olarak sitede görünür
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-white/60">→</span>
                                JSON dosyaları <code className="bg-white/10 px-2 py-1 rounded text-white/90">data/</code> klasöründe
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
