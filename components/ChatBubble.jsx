'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import ContactSection from './ContactSection';

export default function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('ChatBubble');

    return (
        <>
            {/* Chat Bubble Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-yeditepe hover:bg-yeditepe-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300"
                title={t('tooltip')}
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

            {/* Chat Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        />

                        {/* Chat Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-28 right-8 z-50 w-[90vw] sm:w-[900px] max-h-[70vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 overflow-y-auto max-h-[70vh]">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-anton text-2xl text-yeditepe dark:text-white">
                                        {t('tooltip')}
                                    </h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        {t('close')}
                                    </button>
                                </div>
                                <ContactSection />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
