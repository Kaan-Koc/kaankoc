'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

// Simple SVG flags for cross-platform compatibility
const TurkeyFlag = () => (
    <svg className="w-5 h-4" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="24" fill="#E30A17" />
        <circle cx="14" cy="12" r="6" fill="white" />
        <circle cx="16" cy="12" r="5" fill="#E30A17" />
        <path d="M20 12 L23 10.5 L21.5 13.5 L23 16.5 L20 15 L17 16.5 L18.5 13.5 L17 10.5 Z" fill="white" />
    </svg>
);

const UKFlag = () => (
    <svg className="w-5 h-4" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0 0 L60 30 M60 0 L0 30" stroke="white" strokeWidth="6" />
        <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0 L30 30 M0 15 L60 15" stroke="white" strokeWidth="10" />
        <path d="M30 0 L30 30 M0 15 L60 15" stroke="#C8102E" strokeWidth="6" />
    </svg>
);

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();

    // Determine current locale from pathname
    const locale = pathname.startsWith('/en') ? 'en' : 'tr';

    const toggleLocale = () => {
        const newLocale = locale === 'tr' ? 'en' : 'tr';
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPathname);
    };

    return (
        <motion.button
            onClick={toggleLocale}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/20 dark:hover:bg-yeditepe/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="flex items-center gap-2">
                {locale === 'tr' ? <UKFlag /> : <TurkeyFlag />}
                <span className="text-sm font-medium">
                    {locale === 'tr' ? 'EN' : 'TR'}
                </span>
            </span>
        </motion.button>
    );
}
