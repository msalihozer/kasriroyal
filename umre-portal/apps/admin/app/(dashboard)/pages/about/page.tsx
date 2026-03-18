"use client";

import { useState, useEffect } from 'react';
import RichTextEditor from '../../../../components/ui/RichTextEditor';
import { Plus, Trash2, Building, CreditCard, User, MapPin } from 'lucide-react';

interface BankAccount {
    bankName: string;
    accountHolder: string;
    branch: string;
    iban: string;
}

export default function AboutPageAdmin() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');
    const [aboutText, setAboutText] = useState('');
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/site-settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMission(data.mission || '');
                setVision(data.vision || '');
                setAboutText(data.aboutText || '');
                setBankAccounts(Array.isArray(data.bankAccounts) ? data.bankAccounts : []);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            alert('Ayarlar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/site-settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mission,
                    vision,
                    aboutText,
                    bankAccounts
                })
            });

            if (res.ok) {
                alert('Değişiklikler başarıyla kaydedildi.');
            } else {
                alert('Kaydetme başarısız oldu.');
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Kaydederken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const addBankAccount = () => {
        setBankAccounts([...bankAccounts, { bankName: '', accountHolder: '', branch: '', iban: '' }]);
    };

    const removeBankAccount = (index: number) => {
        const newAccounts = [...bankAccounts];
        newAccounts.splice(index, 1);
        setBankAccounts(newAccounts);
    };

    const updateBankAccount = (index: number, field: keyof BankAccount, value: string) => {
        const newAccounts = [...bankAccounts];
        newAccounts[index] = { ...newAccounts[index], [field]: value };
        setBankAccounts(newAccounts);
    };

    if (loading) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Hakkımızda Sayfası Düzenle</h1>
                <p className="text-gray-600 mt-2">Misyon, vizyon ve banka hesap bilgilerini buradan yönetebilirsiniz.</p>
            </header>

            <form onSubmit={handleSave} className="space-y-10">

                {/* Mission & Vision */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                        Kurumsal Yazılar
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <RichTextEditor
                                label="Hakkımızda Metni"
                                value={aboutText}
                                onChange={setAboutText}
                            />
                        </div>
                        <div>
                            <RichTextEditor
                                label="Misyonumuz"
                                value={mission}
                                onChange={setMission}
                            />
                        </div>
                        <div>
                            <RichTextEditor
                                label="Vizyonumuz"
                                value={vision}
                                onChange={setVision}
                            />
                        </div>
                    </div>
                </section>

                {/* Bank Accounts */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                            Banka Hesap Bilgileri
                        </h2>
                        <button
                            type="button"
                            onClick={addBankAccount}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                        >
                            <Plus size={16} />
                            Hesap Ekle
                        </button>
                    </div>

                    <div className="space-y-4">
                        {bankAccounts.length === 0 && (
                            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                                Henüz banka hesabı eklenmemiş.
                            </div>
                        )}

                        {bankAccounts.map((account, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group transition-all hover:shadow-md">
                                <button
                                    type="button"
                                    onClick={() => removeBankAccount(index)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                                    title="Hesabı Sil"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                    {/* Bank Name */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                            <Building size={12} /> Banka Adı
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                            placeholder="Örn: Ziraat Bankası"
                                            value={account.bankName}
                                            onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)}
                                        />
                                    </div>

                                    {/* Account Holder */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                            <User size={12} /> Hesap Sahibi
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                            placeholder="Firma veya Şahıs Adı"
                                            value={account.accountHolder}
                                            onChange={(e) => updateBankAccount(index, 'accountHolder', e.target.value)}
                                        />
                                    </div>

                                    {/* Branch */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                            <MapPin size={12} /> Şube / Şube Kodu
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                            placeholder="Merkez Şube / 1234"
                                            value={account.branch}
                                            onChange={(e) => updateBankAccount(index, 'branch', e.target.value)}
                                        />
                                    </div>

                                    {/* IBAN */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                            <CreditCard size={12} /> IBAN
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                                            placeholder="TR00 0000 0000 0000 0000 0000 00"
                                            value={account.iban}
                                            onChange={(e) => updateBankAccount(index, 'iban', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Submit Action */}
                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t p-4 flex justify-end z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold shadow-lg transition-transform hover:-translate-y-1"
                    >
                        {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>

            </form>
        </div>
    );
}
