'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from '@/lib/i18n';
import { slideInFromLeft, slideInFromRight, staggerContainer } from '@/lib/animations';
import { formatDate } from '@/lib/utils';

export default function Timeline({ experiences, education }) {
    const t = useTranslations('Timeline');
    const locale = useLocale();

    // Combine and sort by date
    const allItems = [
        ...experiences.map((exp) => ({ ...exp, type: 'experience' })),
        ...education.map((edu) => ({ ...edu, type: 'education' })),
    ].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    return (
        <section id="timeline" className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <motion.h2
                        variants={slideInFromLeft}
                        className="font-anton text-4xl md:text-6xl text-yeditepe dark:text-white mb-4"
                    >
                        {t('title')}
                    </motion.h2>
                </motion.div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-yeditepe-200 dark:bg-yeditepe-800" />

                    {allItems.map((item, index) => {
                        const isLeft = index % 2 === 0;
                        const title = item.type === 'experience' ? item.position : item.degree;
                        const subtitle = item.type === 'experience' ? item.company : item.institution;
                        const startDate = formatDate(item.startDate, locale);
                        const endDate = item.endDate
                            ? formatDate(item.endDate, locale)
                            : item.current
                                ? t('present')
                                : null;

                        return (
                            <motion.div
                                key={item.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={isLeft ? slideInFromLeft : slideInFromRight}
                                className={`relative flex flex-col md:flex-row ${isLeft ? 'md:justify-start' : 'md:justify-end'
                                    } mb-12 pl-12 md:pl-0`}
                            >
                                <div
                                    className={`w-full md:w-5/12 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                                        }`}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="glass dark:glass-dark p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative"
                                    >
                                        <div className={`mb-2 flex ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yeditepe text-white">
                                                {item.type === 'experience' ? t('experience') : t('education')}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-yeditepe dark:text-white mb-2">
                                            {title[locale] || title.tr}
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            {subtitle[locale] || subtitle.tr}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            {startDate} - {endDate || t('present')}
                                        </p>
                                        {item.description && item.description[locale] && (
                                            <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                                                {Array.isArray(item.description[locale]) ? (
                                                    item.description[locale].map((desc, i) => (
                                                        <p key={i}>• {desc}</p>
                                                    ))
                                                ) : (
                                                    <p>{item.description[locale]}</p>
                                                )}
                                            </div>
                                        )}
                                        {item.location && (
                                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                                📍 {item.location}
                                            </p>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Timeline dot */}
                                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yeditepe border-4 border-white dark:border-gray-900 rounded-full mt-6 md:mt-0" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
