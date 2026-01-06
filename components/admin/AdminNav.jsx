'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNav({ title, icon, actions, isDashboard = false }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin');
        router.refresh();
    };

    return (
        <nav className="glass border-b border-white/10 mb-8">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-anton text-white flex items-center gap-2">
                    {icon && <span>{icon}</span>}
                    <span>{title}</span>
                </h1>

                <div className="flex gap-4 items-center">
                    {/* Custom Actions */}
                    {actions}

                    {/* Dashboard Navigation */}
                    {!isDashboard ? (
                        <Link
                            href="/admin/dashboard"
                            className="px-4 py-2 glass-light text-white/90 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                        >
                            <span>←</span> Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/"
                                className="px-4 py-2 glass-light text-white/90 rounded-lg hover:bg-white/20 transition-all"
                            >
                                Siteyi Görüntüle
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all backdrop-blur-sm"
                            >
                                Çıkış
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
