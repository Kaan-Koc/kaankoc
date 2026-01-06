'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

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
            <span className="text-sm font-medium">
                {locale === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
            </span>
        </motion.button>
    );
}
