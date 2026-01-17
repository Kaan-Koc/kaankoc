'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
                <div className="relative w-6 h-4 overflow-hidden rounded-sm">
                    <Image
                        src={locale === 'tr'
                            ? 'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg'
                            : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1280px-Flag_of_Turkey.svg.png'
                        }
                        alt={locale === 'tr' ? 'UK Flag' : 'Turkey Flag'}
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="text-sm font-medium">
                    {locale === 'tr' ? 'EN' : 'TR'}
                </span>
            </span>
        </motion.button>
    );
}
