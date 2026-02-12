'use client';

import SecuritySettings from '@/components/admin/SecuritySettings';
import AdminNav from '@/components/admin/AdminNav';
import { motion } from 'framer-motion';

export default function AdminSecurityPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yeditepe via-yeditepe-dark to-black">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-yeditepe-light rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yeditepe rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Navigation */}
                <AdminNav title="Güvenlik Ayarları" />

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-anton text-white mb-10"
                    >
                        Güvenlik Ayarları
                    </motion.h2>

                    <SecuritySettings />
                </div>
            </div>
        </div>
    );
}
