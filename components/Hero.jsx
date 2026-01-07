'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import { slideInFromLeft, slideInFromBottom, fadeIn } from '@/lib/animations';

export default function Hero() {
    const t = useTranslations('Hero');

    const scrollToProjects = () => {
        const element = document.getElementById('projects');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            id="hero"
            className="relative min-h-[110dvh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50 to-yeditepe-100 dark:from-gray-900 dark:via-yeditepe-900 dark:to-gray-900"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 bg-yeditepe rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    className="hidden md:block absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 md:py-32 text-center">
                <motion.p
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="text-lg md:text-xl text-yeditepe-600 dark:text-yeditepe-300 mb-4"
                >
                    {t('greeting')}
                </motion.p>

                <motion.h1
                    variants={slideInFromLeft}
                    initial="hidden"
                    animate="visible"
                    className="font-anton text-6xl md:text-8xl lg:text-9xl text-yeditepe dark:text-white mb-10 tracking-tight"
                >
                    {t('title')}
                </motion.h1>

                <motion.h2
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-4xl text-gray-700 dark:text-gray-300 mb-10"
                >
                    {t('subtitle')}
                </motion.h2>

                <motion.p
                    variants={slideInFromBottom}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
                >
                    {t('description')}
                </motion.p>

                <motion.button
                    variants={slideInFromBottom}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToProjects}
                    className="px-8 py-4 bg-yeditepe hover:bg-yeditepe-700 text-white rounded-lg text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                    {t('cta')}
                </motion.button>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 1.5,
                }}
                className="absolute bottom-12 md:bottom-8 left-0 right-0 mx-auto w-6"
            >
                <div className="w-6 h-10 border-2 border-yeditepe dark:border-white rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-yeditepe dark:bg-white rounded-full mt-2" />
                </div>
            </motion.div>
        </section>
    );
}
