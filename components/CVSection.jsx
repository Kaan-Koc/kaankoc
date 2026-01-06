'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import { slideInFromBottom, staggerContainer } from '@/lib/animations';

export default function CVSection() {
    const t = useTranslations('CV'); // You'll need to add translations for this
    const [cvs, setCvs] = useState([]);

    useEffect(() => {
        // Fetch all CVs
        fetch('/api/admin/cv')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data) && data.length > 0) {
                    setCvs(data);
                }
            })
            .catch(err => console.error('Error fetching CVs:', err));
    }, []);

    if (cvs.length === 0) return null;

    return (
        <section id="cv" className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center"
                >
                    <motion.h2
                        variants={slideInFromBottom}
                        className="font-anton text-4xl md:text-6xl text-yeditepe dark:text-white mb-8"
                    >
                        {t('title')}
                    </motion.h2>

                    <motion.div
                        variants={slideInFromBottom}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        {cvs.map((cv) => (
                            <motion.div
                                key={cv.name}
                                whileHover={{ y: -5 }}
                                className="glass p-4 rounded-xl flex flex-col items-center gap-4 group hover:bg-white/10 transition-all border border-transparent hover:border-yeditepe/30 w-full max-w-sm"
                            >
                                <h3 className="text-xl font-bold text-yeditepe dark:text-white truncate max-w-full text-center mb-2">
                                    {cv.name.replace(/.pdf$/i, '').replace(/[-_]/g, ' ')}
                                </h3>

                                {/* PDF Preview */}
                                <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative group-hover:border-yeditepe/50 transition-colors">
                                    <iframe
                                        src={`${cv.url}#toolbar=0`}
                                        className="w-full h-full"
                                        title={`${cv.name} preview`}
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex gap-3 mt-2 w-full">
                                    <a
                                        href={cv.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-yeditepe text-white font-medium rounded-lg hover:bg-yeditepe-dark transition-colors shadow-lg hover:shadow-yeditepe/30"
                                    >
                                        👁️ Tam Ekran
                                    </a>

                                    <a
                                        href={cv.url}
                                        download={cv.name}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-white text-yeditepe border-2 border-yeditepe font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
                                    >
                                        ⬇️ İndir
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
