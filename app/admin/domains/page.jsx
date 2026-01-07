'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminDomains() {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastCheck, setLastCheck] = useState(null);

    const fetchDomains = async (forceRefresh = false) => {
        try {
            setRefreshing(true);
            const cacheParam = forceRefresh ? '?cache=false' : '';
            const res = await fetch(`/api/admin/domains${cacheParam}`);
            const data = await res.json();
            setDomains(data.domains || []);

            // Get last check time from the first domain
            if (data.domains && data.domains.length > 0) {
                setLastCheck(data.domains[0].lastChecked);
            }
        } catch (error) {
            console.error('Error fetching domains:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    const getDomainStatusColor = (status, daysRemaining) => {
        if (status === 'available') return 'text-red-500';
        if (status === 'error') return 'text-yellow-500';
        if (daysRemaining !== null) {
            if (daysRemaining <= 7) return 'text-red-500';
            if (daysRemaining <= 30) return 'text-orange-500';
        }
        return 'text-green-500';
    };

    const getDomainStatusText = (status, daysRemaining) => {
        if (status === 'available') return '❌ Boşa Düştü';
        if (status === 'error') return '⚠️ Hata';
        if (daysRemaining !== null) {
            if (daysRemaining <= 7) return `🚨 ${daysRemaining} Gün Kaldı!`;
            if (daysRemaining <= 30) return `⚠️ ${daysRemaining} Gün Kaldı`;
            return `✅ ${daysRemaining} Gün Kaldı`;
        }
        return '✅ Aktif';
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yeditepe via-yeditepe-dark to-black">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-yeditepe-light rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yeditepe rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <AdminNav title="Domain İzleme" icon="����" />

                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-anton text-white mb-2">Domain Durumu</h2>
                            {lastCheck && (
                                <p className="text-white/60 text-sm">
                                    Son Kontrol: {new Date(lastCheck).toLocaleString('tr-TR')}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => fetchDomains(true)}
                            disabled={refreshing}
                            className="px-6 py-3 bg-yeditepe text-white rounded-lg hover:bg-yeditepe-light transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                            {refreshing ? 'Kontrol Ediliyor...' : 'Şimdi Kontrol Et'}
                        </button>
                    </div>

                    {/* Domains Grid */}
                    {loading ? (
                        <div className="text-center text-white py-12">
                            <div className="animate-spin text-4xl mb-4">⏳</div>
                            <p>Domain bilgileri yükleniyor...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {domains.map((domain, index) => (
                                <motion.div
                                    key={domain.domain}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass p-6 rounded-xl border border-white/20"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold text-white">{domain.domain}</h3>
                                        <span className={`text-2xl ${getDomainStatusColor(domain.status, domain.daysRemaining)}`}>
                                            {domain.status === 'active' ? '✅' : domain.status === 'available' ? '❌' : '⚠️'}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-white/60 text-sm">Durum</p>
                                            <p className={`text-lg font-semibold ${getDomainStatusColor(domain.status, domain.daysRemaining)}`}>
                                                {getDomainStatusText(domain.status, domain.daysRemaining)}
                                            </p>
                                        </div>

                                        {domain.registrationDate && (
                                            <div>
                                                <p className="text-white/60 text-sm">Kayıt Tarihi</p>
                                                <p className="text-white">
                                                    {new Date(domain.registrationDate).toLocaleDateString('tr-TR')}
                                                </p>
                                            </div>
                                        )}

                                        {domain.expirationDate && (
                                            <div>
                                                <p className="text-white/60 text-sm">Bitiş Tarihi</p>
                                                <p className="text-white">
                                                    {new Date(domain.expirationDate).toLocaleDateString('tr-TR')}
                                                </p>
                                            </div>
                                        )}

                                        {domain.registrar && domain.registrar !== 'Unknown' && (
                                            <div>
                                                <p className="text-white/60 text-sm">Registrar</p>
                                                <p className="text-white">{domain.registrar}</p>
                                            </div>
                                        )}

                                        {domain.daysRemaining !== null && domain.daysRemaining > 0 && (
                                            <div>
                                                <p className="text-white/60 text-sm mb-2">Kalan Süre</p>
                                                <div className="w-full bg-white/10 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${domain.daysRemaining <= 7 ? 'bg-red-500' :
                                                                domain.daysRemaining <= 30 ? 'bg-orange-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${Math.min((domain.daysRemaining / 365) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Info Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass p-6 rounded-xl border border-white/20 mt-8"
                    >
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span>💡</span> Otomatik İzleme
                        </h3>
                        <ul className="space-y-2 text-white/80">
                            <li className="flex items-start gap-2">
                                <span className="text-white/60">→</span>
                                Domain'ler her gün otomatik olarak kontrol edilir
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-white/60">→</span>
                                30 gün kala uyarı maili gönderilir
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-white/60">→</span>
                                7 gün kala acil uyarı maili gönderilir
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-white/60">→</span>
                                Domain boşa düşerse anında bildirim alırsınız
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
