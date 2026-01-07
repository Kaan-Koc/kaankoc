'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import { socialLinks } from '@/data/socials';

export default function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Chat'); // Using 'Chat' namespace if available, or fallback
    const bubbleRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bubbleRef.current && !bubbleRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={bubbleRef}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 w-[320px] sm:w-[500px]"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span>👋</span> {t('title') || 'Social Media'}
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target={social.name === 'Email' ? undefined : '_blank'}
                                    rel={social.name === 'Email' ? undefined : 'noopener noreferrer'}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-600 shadow-sm"
                                >
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors"
                                        style={{ color: social.color, backgroundColor: `${social.color}15` }}
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill={social.name === 'Email' ? 'none' : 'currentColor'}
                                            stroke={social.name === 'Email' ? 'currentColor' : 'none'}
                                            viewBox={social.viewBox || '0 0 24 24'}
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            {social.icon}
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{social.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full">{social.username}</span>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Bubble Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-yeditepe hover:bg-yeditepe-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 relative"
                title="Social Links"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            className="text-2xl"
                        >
                            ✕
                        </motion.span>
                    ) : (
                        <motion.span
                            key="chat"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="text-2xl"
                        >
                            💬
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
