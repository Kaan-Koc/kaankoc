import { Inter, Anton } from 'next/font/google';
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
  title: 'Kaan Koç - Admin Panel',
  description: 'Portfolio admin panel',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${anton.variable}`}>{children}</body>
    </html>
  );
}
