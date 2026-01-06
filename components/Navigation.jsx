'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
    const [isDark, setIsDark] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Navigation');

    useEffect(() => {
        // Check if dark mode is enabled
        const darkMode = localStorage.getItem('darkMode') === 'true';
        setIsDark(darkMode);
        if (darkMode) {
            document.documentElement.classList.add('dark');
        }

        // Handle scroll
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);

        // Close mobile menu when screen resizes
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDark;
        setIsDark(newDarkMode);
        localStorage.setItem('darkMode', String(newDarkMode));

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isOpen
                ? 'glass dark:glass-dark shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        className="relative w-10 h-10 cursor-pointer z-50 rounded-full overflow-hidden border-2 border-yeditepe dark:border-white"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => scrollToSection('hero')}
                    >
                        <Image
                            src="/images/profile-logo.jpg"
                            alt="Kaan Koç"
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {['home', 'about', 'projects', 'certificates', 'cv', 'contact'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item === 'home' ? 'hero' : item === 'about' ? 'timeline' : item)}
                                className="text-gray-700 dark:text-gray-300 hover:text-yeditepe dark:hover:text-white transition-colors capitalize"
                            >
                                {t(item)}
                            </button>
                        ))}

                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg glass hover:bg-white/20 dark:hover:bg-yeditepe/20 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isDark ? '☀️' : '🌙'}
                        </motion.button>

                        {/* Language Switcher */}
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center z-50 gap-4">
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-yeditepe dark:text-white focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                                <motion.span
                                    animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                    className="block w-full h-0.5 bg-current origin-center transition-transform"
                                />
                                <motion.span
                                    animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className="block w-full h-0.5 bg-current transition-opacity"
                                />
                                <motion.span
                                    animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                    className="block w-full h-0.5 bg-current origin-center transition-transform"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 pt-16"
                    >
                        {['home', 'about', 'projects', 'certificates', 'cv', 'contact'].map((item) => (
                            <motion.button
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                onClick={() => scrollToSection(item === 'home' ? 'hero' : item === 'about' ? 'timeline' : item)}
                                className="text-2xl font-anton text-yeditepe dark:text-white hover:text-blue-500 transition-colors uppercase"
                            >
                                {t(item)}
                            </motion.button>
                        ))}

                        <div className="flex items-center gap-6 mt-8">
                            <motion.button
                                onClick={toggleDarkMode}
                                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-2xl"
                                whileTap={{ scale: 0.9 }}
                            >
                                {isDark ? '☀️' : '🌙'}
                            </motion.button>
                            <div onClick={(e) => e.stopPropagation()}>
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
