
"use client";

import { useState, useEffect } from 'react';
import { Save, Mail, Loader2, MessageSquare } from 'lucide-react';

export default function EmailSettingsPage() {
    const [settings, setSettings] = useState({
        host: '',
        port: 587,
        user: '',
        pass: '',
        fromEmail: '',
        notificationEmail: '',
        whatsappEnabled: false,
        whatsappInstanceId: '',
        whatsappToken: '',
        whatsappPhone: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/settings/email`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.id) setSettings(data);
            }
        } catch (error) {
            console.error('Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/settings/email`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert('Ayarlar kaydedildi');
            } else {
                alert('Hata oluştu');
            }
        } catch (error) {
            alert('Bağlantı hatası');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Mail /> E-posta Ayarları (SMTP)
            </h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border max-w-2xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                        <input
                            type="text"
                            name="host"
                            value={settings.host}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="smtp.example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                        <input
                            type="number"
                            name="port"
                            value={settings.port}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="587"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı (Email)</label>
                        <input
                            type="text"
                            name="user"
                            value={settings.user}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                        <input
                            type="password"
                            name="pass"
                            value={settings.pass}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <div className="border-t pt-4 mt-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600">
                        <MessageSquare size={20} /> WhatsApp Bildirim Ayarları (UltraMsg)
                    </h2>
                    
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            id="whatsappEnabled"
                            name="whatsappEnabled"
                            checked={settings.whatsappEnabled}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 rounded"
                        />
                        <label htmlFor="whatsappEnabled" className="text-sm font-medium text-gray-700">
                            WhatsApp Bildirimlerini Aktif Et
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4 opacity-100 transition-opacity duration-200" style={{ opacity: settings.whatsappEnabled ? 1 : 0.5 }}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instance ID</label>
                            <input
                                type="text"
                                name="whatsappInstanceId"
                                value={settings.whatsappInstanceId}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                placeholder="instance123456"
                                disabled={!settings.whatsappEnabled}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
                            <input
                                type="password"
                                name="whatsappToken"
                                value={settings.whatsappToken}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                placeholder="ultramsg-token"
                                disabled={!settings.whatsappEnabled}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bildirim Gidecek Telefon (Uluslararası format)</label>
                            <input
                                type="text"
                                name="whatsappPhone"
                                value={settings.whatsappPhone}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                placeholder="905XXXXXXXXX"
                                disabled={!settings.whatsappEnabled}
                            />
                            <p className="text-xs text-gray-500 mt-1">Başvuruların bildirim olarak düşeceği telefon numarası.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Ayarları Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
}
