import { Inter } from 'next/font/google';
import { Bebas_Neue } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-anton',
  display: 'swap',
});

export const metadata = {
  title: 'Kaan Koç - Admin Panel',
  description: 'Portfolio admin panel',
  icons: {
    icon: '/images/favicon-circle.png',
    shortcut: '/images/favicon-circle.png',
    apple: '/images/favicon-circle.png',
  },
};

export default function AdminLayout({ children }) {
  return (
    <html lang="tr" style={{ scrollBehavior: 'auto' }}>
      <body className={`${inter.variable} ${bebasNeue.variable} dark antialiased`} style={{ overflowAnchor: 'none' }}>{children}</body>
    </html>
  );
}
