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

    <motion.button
        onClick={toggleLocale}
        className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/20 dark:hover:bg-yeditepe/20 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <span className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-white/20 dark:bg-yeditepe/20 rounded text-xs font-bold">
                {locale === 'tr' ? 'GB' : 'TR'}
            </span>
            <span className="text-sm font-medium">
                {locale === 'tr' ? 'EN' : 'TR'}
            </span>
        </span>
    </motion.button>
}
