'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import Image from 'next/image';
import { staggerContainer, slideInFromBottom, scaleIn } from '@/lib/animations';
import { formatDate } from '@/lib/utils';

export default function CertificateWall({ certificates }) {
    const t = useTranslations('Certificates');

    return (
        <section id="certificates" className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <motion.h2
                        variants={slideInFromBottom}
                        className="font-anton text-4xl md:text-6xl text-yeditepe dark:text-white mb-4"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        variants={slideInFromBottom}
                        className="text-lg text-gray-600 dark:text-gray-400"
                    >
                        {t('subtitle')}
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {certificates.map((cert) => (
                        <motion.a
                            key={cert.id}
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={scaleIn}
                            whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                            className="group relative glass dark:glass-dark p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                            {/* Badge glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-yeditepe/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative z-10">
                                {/* Certificate Logo */}
                                {cert.logo && (
                                    <div className="relative w-20 h-20 mx-auto mb-4">
                                        <Image
                                            src={cert.logo}
                                            alt={cert.issuer}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}

                                {/* Certificate Info */}
                                <h3 className="text-center font-bold text-gray-900 dark:text-white mb-2 text-sm">
                                    {cert.name}
                                </h3>
                                <p className="text-center text-xs text-gray-600 dark:text-gray-400 mb-3">
                                    {cert.issuer} {t('issuedBy')}
                                </p>
                                <p className="text-center text-xs text-gray-500 dark:text-gray-500">
                                    {formatDate(cert.issueDate)}
                                </p>

                                {/* View credential link */}
                                {cert.credentialUrl && (
                                    <div className="mt-4 text-center">
                                        <span className="text-xs text-yeditepe dark:text-yeditepe-300 group-hover:underline">
                                            {t('viewCredential')} →
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
