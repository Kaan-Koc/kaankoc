'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import { slideInFromBottom, staggerContainer } from '@/lib/animations';
import { socialLinks } from '@/data/socials';
import ContactForm from './ContactForm';

export default function ContactSection() {
    const t = useTranslations('Contact');

    return (
        <section id="contact" className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

                {/* Social Media Links from data source */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="flex flex-wrap justify-center gap-6 mb-16"
                >
                    {socialLinks.map((social) => (
                        <motion.a
                            key={social.name}
                            href={social.url}
                            target={social.name === 'Email' ? undefined : '_blank'}
                            rel={social.name === 'Email' ? undefined : 'noopener noreferrer'}
                            variants={slideInFromBottom}
                            whileHover={{ y: -5 }}
                            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group w-full md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] min-w-[200px]"
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300"
                                style={{
                                    backgroundColor: `${social.color}15`,
                                    color: social.color
                                }}
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
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1" style={{ color: 'inherit' }} >{social.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate w-full text-center px-2">{social.username}</p>
                            <style jsx>{`
                                .group:hover div {
                                    background-color: ${social.color} !important;
                                    color: white !important;
                                }
                            `}</style>
                        </motion.a>
                    ))}
                </motion.div>

                {/* Reusable Contact Form */}
                <ContactForm />
            </div>
        </section>
    );
}
