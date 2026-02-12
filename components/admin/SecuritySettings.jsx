'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Yeni şifre en az 8 karakter olmalı!' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor!' });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({
                    type: 'success',
                    text: 'Şifre başarıyla değiştirildi! Diğer tüm oturumlar kapatıldı.'
                });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');

                // Show the new password hash to update in environment
                if (data.newPasswordHash) {
                    console.log('🔑 YENİ ŞİFRE HASH (Environment değişkenine ekleyin):');
                    console.log(data.newPasswordHash);
                }
            } else {
                setMessage({ type: 'error', text: data.error || 'Bir hata oluştu!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Bağlantı hatası!' });
        } finally {
            setLoading(false);
        }
    };

    const handleInvalidateAllSessions = async () => {
        if (!confirm('Tüm oturumları kapatmak istediğinizden emin misiniz? Tekrar giriş yapmanız gerekecek.')) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/invalidate-sessions', {
                method: 'POST',
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({
                    type: 'success',
                    text: 'Tüm oturumlar kapatıldı! Lütfen tekrar giriş yapın.'
                });

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Bir hata oluştu!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Bağlantı hatası!' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Change Password Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-xl border border-white/20"
            >
                <h3 className="text-2xl font-anton text-white mb-6 flex items-center gap-2">
                    <span>🔒</span> Şifre Değiştir
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white/90">
                            Mevcut Şifre
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 outline-none"
                            placeholder="Mevcut şifrenizi girin"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-white/90">
                            Yeni Şifre
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 outline-none"
                            placeholder="Yeni şifrenizi girin (min 8 karakter)"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-white/90">
                            Yeni Şifre (Tekrar)
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 outline-none"
                            placeholder="Yeni şifrenizi tekrar girin"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-yeditepe font-semibold py-3 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50"
                    >
                        {loading ? 'İşleniyor...' : 'Şifreyi Değiştir'}
                    </button>
                </form>
            </motion.div>

            {/* Invalidate Sessions Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-6 rounded-xl border border-white/20"
            >
                <h3 className="text-2xl font-anton text-white mb-4 flex items-center gap-2">
                    <span>🚪</span> Oturum Yönetimi
                </h3>

                <p className="text-white/80 mb-4">
                    Tüm cihazlardaki oturumlarınızı kapatın. Bu işlem sonrasında tekrar giriş yapmanız gerekecektir.
                </p>

                <button
                    onClick={handleInvalidateAllSessions}
                    disabled={loading}
                    className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                >
                    {loading ? 'İşleniyor...' : 'Tüm Oturumları Kapat'}
                </button>
            </motion.div>

            {/* Message Display */}
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                >
                    {message.text}
                </motion.div>
            )}

            {/* Security Tips */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 rounded-xl border border-white/20"
            >
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <span>💡</span> Güvenlik İpuçları
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex items-start gap-2">
                        <span className="text-white/60">→</span>
                        Şifrenizi düzenli olarak değiştirin
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-white/60">→</span>
                        Güçlü şifreler kullanın (büyük/küçük harf, rakam, özel karakter)
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-white/60">→</span>
                        Başka bir cihazda oturumunuz açık kaldıysa tüm oturumları kapatın
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-white/60">→</span>
                        Şifrenizi kimseyle paylaşmayın
                    </li>
                </ul>
            </motion.div>
        </div>
    );
}
