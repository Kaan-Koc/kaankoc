'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import { slideInFromBottom, staggerContainer } from '@/lib/animations';

export default function ContactSection() {
    const t = useTranslations('Contact');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

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

                {/* Social Media Links */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="flex flex-wrap justify-center gap-6 mb-16"
                >
                    {[
                        {
                            name: 'LinkedIn',
                            username: '@kaankoç',
                            url: 'https://www.linkedin.com/in/kaanko%C3%A7',
                            color: '#0077b5',
                            viewBox: '0 0 24 24',
                            icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        },
                        {
                            name: 'Instagram',
                            username: '@kaan.doc',
                            url: 'https://www.instagram.com/kaan.doc',
                            color: '#E1306C',
                            viewBox: '0 0 24 24',
                            icon: <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.37c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        },
                        {
                            name: 'TikTok',
                            username: '@glusking',
                            url: 'https://www.tiktok.com/@glusking',
                            color: '#000000',
                            viewBox: '0 0 16 16',
                            icon: <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                        },
                        {
                            name: 'YouTube',
                            username: '@glusking',
                            url: 'https://www.youtube.com/@glusking',
                            color: '#FF0000',
                            viewBox: '0 0 16 16',
                            icon: <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                        },
                        {
                            name: 'Twitch',
                            username: 'glusking',
                            url: 'https://www.twitch.tv/glusking',
                            color: '#9146FF',
                            viewBox: '0 0 16 16',
                            icon: <path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142zM11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z" />
                        },
                        {
                            name: 'Kick',
                            username: 'glusking',
                            url: 'https://kick.com/glusking',
                            color: '#53FC18', // Kick Green
                            viewBox: '0 0 24 24',
                            icon: <path d="M19.2,2.4H4.8C3.47,2.4,2.4,3.47,2.4,4.8v14.4c0,1.33,1.07,2.4,2.4,2.4h14.4c1.33,0,2.4-1.07,2.4-2.4V4.8C21.6,3.47,20.53,2.4,19.2,2.4z M9.6,15.6H7.2V8.4h2.4v2.4l3.6-2.4h2.4l-3.6,3.6l3.6,3.6h-2.4l-3.6-2.4V15.6z" />
                        },
                        {
                            name: 'Email',
                            username: 'kaankociletisim@gmail.com',
                            url: 'mailto:kaankociletisim@gmail.com',
                            color: '#EF4444',
                            viewBox: '0 0 24 24',
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        }
                    ].map((social) => (
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
                                    viewBox={social.viewBox || "0 0 24 24"}
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

                <motion.form
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <motion.div variants={slideInFromBottom}>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            {t('name')}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder={t('namePlaceholder')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yeditepe focus:border-transparent transition-all"
                        />
                    </motion.div>

                    <motion.div variants={slideInFromBottom}>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            {t('email')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder={t('emailPlaceholder')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yeditepe focus:border-transparent transition-all"
                        />
                    </motion.div>

                    <motion.div variants={slideInFromBottom}>
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            {t('message')}
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={6}
                            placeholder={t('messagePlaceholder')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yeditepe focus:border-transparent transition-all resize-none"
                        />
                    </motion.div>

                    <motion.button
                        variants={slideInFromBottom}
                        type="submit"
                        disabled={status === 'sending'}
                        whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                        whileTap={{ scale: status === 'sending' ? 1 : 0.98 }}
                        className="w-full px-8 py-4 bg-yeditepe hover:bg-yeditepe-700 disabled:bg-gray-400 text-white rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed"
                    >
                        {status === 'sending' ? t('sending') : t('send')}
                    </motion.button>

                    {/* Status messages */}
                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center"
                        >
                            {t('success')}
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-center"
                        >
                            {t('error')}
                        </motion.div>
                    )}
                </motion.form>
            </div>
        </section>
    );
}
