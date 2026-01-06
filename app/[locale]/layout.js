import { Inter, Anton } from 'next/font/google';
import { I18nProvider } from '@/lib/i18n';
import '../globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const anton = Anton({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-anton',
    display: 'swap',
});

export const metadata = {
    title: 'Kaan Koç - Marketing & Technology Expert',
    description: 'Portfolio website of Kaan Koç - Digital marketing strategist and web developer creating impactful experiences.',
    keywords: 'marketing, technology, web development, digital marketing, portfolio',
    authors: [{ name: 'Kaan Koç' }],
    openGraph: {
        title: 'Kaan Koç - Marketing & Technology Expert',
        description: 'Portfolio website showcasing projects, experience, and achievements.',
        type: 'website',
        locale: 'tr_TR',
        alternateLocale: 'en_US',
    },
};

export function generateStaticParams() {
    return [{ locale: 'tr' }, { locale: 'en' }];
}

import trMessages from '../../messages/tr.json';
import enMessages from '../../messages/en.json';

const messagesMap = {
    tr: trMessages,
    en: enMessages,
};

export default async function RootLayout({ children, params }) {
    const { locale } = await params;

    // Load messages for the current locale
    const messages = messagesMap[locale] || messagesMap.en;

    return (
        <html lang={locale} className={`${inter.variable} ${anton.variable}`}>
            <body className="antialiased">
                <I18nProvider locale={locale} messages={messages}>
                    {children}
                </I18nProvider>
            </body>
        </html>
    );
}
