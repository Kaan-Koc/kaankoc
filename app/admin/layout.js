import { Inter, Anton } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const anton = Anton({
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
      <body className={`${inter.variable} ${anton.variable} dark antialiased`} style={{ overflowAnchor: 'none' }}>{children}</body>
    </html>
  );
}
