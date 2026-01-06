'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/admin/messages');
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/admin/messages?id=${deleteId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setMessages(messages.filter((msg) => msg.id !== deleteId));
                setDeleteId(null);
                if (selectedMessage?.id === deleteId) {
                    setSelectedMessage(null);
                }
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    if (isLoading) {
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
            <div className="relative z-10 w-full h-screen flex flex-col">
                {/* Navigation */}
                <nav className="glass border-b border-white/10 flex-none">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-anton text-white flex items-center gap-2">
                            <span>✉️</span> Mesajlar
                            <span className="text-sm font-sans font-normal bg-white/10 px-2 py-0.5 rounded-full ml-2 text-white/70">
                                {messages.length}
                            </span>
                        </h1>
                        <Link
                            href="/admin/dashboard"
                            className="px-4 py-2 glass-light text-white/90 rounded-lg hover:bg-white/20 transition-all"
                        >
                            ← Dashboard
                        </Link>
                    </div>
                </nav>

                {/* Main Layout */}
                <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Message List */}
                    <div className="lg:col-span-1 glass rounded-xl border border-white/10 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/10 bg-white/5">
                            <h2 className="text-white/90 font-semibold">Gelen Kutusu</h2>
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-2">
                            {messages.length === 0 ? (
                                <div className="text-center py-10 text-white/50">
                                    <p>Henüz mesaj yok</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all border ${selectedMessage?.id === msg.id
                                            ? 'bg-yeditepe/50 border-yeditepe-light/50 ring-1 ring-yeditepe-light/50'
                                            : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`font-bold text-sm ${selectedMessage?.id === msg.id ? 'text-white' : 'text-white/90'}`}>
                                                {msg.name}
                                            </h3>
                                            <span className={`text-xs ${selectedMessage?.id === msg.id ? 'text-white/70' : 'text-white/50'}`}>
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${selectedMessage?.id === msg.id ? 'text-white/80' : 'text-white/60'}`}>
                                            {msg.email}
                                        </p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Message Detail */}
                    <div className="lg:col-span-2 glass rounded-xl border border-white/10 flex flex-col h-full bg-black/20">
                        <AnimatePresence mode="wait">
                            {selectedMessage ? (
                                <motion.div
                                    key={selectedMessage.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex flex-col h-full"
                                >
                                    {/* Header */}
                                    <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-start backdrop-blur-sm rounded-t-xl">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                                {selectedMessage.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-1">
                                                    {selectedMessage.name}
                                                </h2>
                                                <a
                                                    href={`mailto:${selectedMessage.email}`}
                                                    className="text-blue-300 hover:text-white transition-colors font-medium flex items-center gap-2"
                                                >
                                                    ✉️ {selectedMessage.email}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-white/50 text-sm">
                                                {new Date(selectedMessage.createdAt).toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() => setDeleteId(selectedMessage.id)}
                                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2 text-sm group"
                                            >
                                                <span className="group-hover:text-red-300">Sil</span>
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 overflow-y-auto flex-1">
                                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-white/90 text-lg leading-relaxed whitespace-pre-wrap min-h-[300px]">
                                            {selectedMessage.message}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-white/30 p-12">
                                    <div className="text-6xl mb-4">📩</div>
                                    <p className="text-xl font-light">Okumak için soldan bir mesaj seçin</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Mesajı Sil"
                message="Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
            />
        </div>
    );
}
