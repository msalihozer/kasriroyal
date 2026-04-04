"use client";
import { useState, useEffect } from 'react';
import ImageUpload from '../../../components/ui/ImageUpload';
import RichTextEditor from '../../../components/ui/RichTextEditor';
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface PhoneItem {
    label: string;
    number: string;
}

interface FooterLogo {
    imageUrl: string;
    link: string;
    alt: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        logoUrl: '',
        faviconUrl: '',
        heroVideoUrl: '',
        heroTitle: '',
        heroSubtitle: '',
        heroTitleColor: '#ffffff',
        tourImportantNotes: '',

        // Dynamic Lists
        footerLogos: [] as FooterLogo[],
        phones: [] as PhoneItem[],

        // Contact
        firmName: '',
        address: '',
        email: '',
        mapEmbedUrl: '',

        socialLinks: {
            instagram: '',
            facebook: '',
            whatsapp: '',
            youtube: ''
        },

        // Legal
        kvkkText: '',
        privacyPolicyText: '',
        distanceSalesText: '',
        cancellationText: ''
    });
    const [emailSettings, setEmailSettings] = useState({
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
    const [saving, setSaving] = useState(false);
    const [testingMail, setTestingMail] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        fetchSettings();
        fetchEmailSettings();
    }, []);

    const fetchEmailSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/settings/email`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.host) {
                    setEmailSettings(data);
                }
            }
        } catch (err) {
            console.error('Error fetching email settings:', err);
        }
    };

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/site-settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    // Migration Logic for Phones
                    let initialPhones = Array.isArray(data.phones) ? data.phones : [];
                    if (initialPhones.length === 0 && data.phone) {
                        initialPhones = [{ label: 'Merkez', number: data.phone }];
                    }

                    // Migration Logic for Footer Logos
                    let initialFooterLogos = Array.isArray(data.footerLogos) ? data.footerLogos : [];
                    if (initialFooterLogos.length === 0) {
                        if (data.footerDiyanetImageUrl) {
                            initialFooterLogos.push({
                                imageUrl: data.footerDiyanetImageUrl,
                                link: data.footerDiyanetLink || '#',
                                alt: 'Diyanet'
                            });
                        }
                        if (data.footerAgencyImageUrl) {
                            initialFooterLogos.push({
                                imageUrl: data.footerAgencyImageUrl,
                                link: data.footerAgencyLink || '#',
                                alt: 'TURSAB'
                            });
                        }
                    }

                    setSettings({
                        ...data,
                        heroVideoUrl: data.heroVideoUrl || '',
                        heroTitle: data.heroTitle || '',
                        heroSubtitle: data.heroSubtitle || '',
                        heroTitleColor: data.heroTitleColor || '#ffffff',
                        tourImportantNotes: data.tourImportantNotes || '',

                        phones: initialPhones,
                        footerLogos: initialFooterLogos,

                        firmName: data.firmName || '',
                        address: data.address || '',
                        email: data.email || '',
                        mapEmbedUrl: data.mapEmbedUrl || '',

                        socialLinks: data.socialLinks || { instagram: '', facebook: '', whatsapp: '', youtube: '' },
                        
                        kvkkText: data.kvkkText || '',
                        privacyPolicyText: data.privacyPolicyText || '',
                        distanceSalesText: data.distanceSalesText || '',
                        cancellationText: data.cancellationText || ''
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            
            // Save Site Settings
            const siteRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/site-settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            // Save Email Settings
            const emailRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/settings/email`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(emailSettings)
            });

            if (siteRes.ok && emailRes.ok) {
                alert('Tüm ayarlar kaydedildi');
            } else {
                alert('Bazı ayarlar kaydedilemedi');
            }
        } catch (err) {
            alert('Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const handleTestEmail = async () => {
        setTestingMail(true);
        setTestResult(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/settings/email/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(emailSettings)
            });
            const data = await res.json();
            setTestResult(data);
        } catch (err) {
            setTestResult({ success: false, message: 'İstek sırasında bir hata oluştu.' });
        } finally {
            setTestingMail(false);
        }
    };

    // Helper functions for dynamic lists
    const addPhone = () => {
        setSettings({ ...settings, phones: [...settings.phones, { label: '', number: '' }] });
    };

    const removePhone = (index: number) => {
        const newPhones = [...settings.phones];
        newPhones.splice(index, 1);
        setSettings({ ...settings, phones: newPhones });
    };

    const updatePhone = (index: number, field: keyof PhoneItem, value: string) => {
        const newPhones = [...settings.phones];
        newPhones[index] = { ...newPhones[index], [field]: value };
        setSettings({ ...settings, phones: newPhones });
    };

    const addFooterLogo = () => {
        setSettings({ ...settings, footerLogos: [...settings.footerLogos, { imageUrl: '', link: '', alt: '' }] });
    };

    const removeFooterLogo = (index: number) => {
        const newLogos = [...settings.footerLogos];
        newLogos.splice(index, 1);
        setSettings({ ...settings, footerLogos: newLogos });
    };

    const updateFooterLogo = (index: number, field: keyof FooterLogo, value: string) => {
        const newLogos = [...settings.footerLogos];
        newLogos[index] = { ...newLogos[index], [field]: value };
        setSettings({ ...settings, footerLogos: newLogos });
    };

    return (
        <div className="max-w-4xl pb-20">
            <h1 className="text-3xl font-bold mb-6">Site Ayarları</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-8">
                {/* General */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Genel Görseller</h2>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <ImageUpload
                                value={settings.logoUrl}
                                onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                                label="Site Logo"
                                disabledCrop={true}
                            />
                        </div>
                        <div>
                            <ImageUpload
                                value={settings.faviconUrl}
                                onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
                                label="Favicon"
                                disabledCrop={true}
                            />
                        </div>
                    </div>
                </section>

                {/* Hero Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Anasayfa Hero Alanı</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <ImageUpload
                                    value={settings.heroVideoUrl}
                                    onChange={(url) => setSettings({ ...settings, heroVideoUrl: url })}
                                    label="Arkaplan Videosu (MP4)"
                                />
                                {settings.heroVideoUrl && (
                                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-500 break-all">
                                        Video URL: {settings.heroVideoUrl}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Önerilen: 1920x1080px, max 10MB MP4</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg p-2"
                                        value={settings.heroTitle || ''}
                                        onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg p-2"
                                        value={settings.heroSubtitle || ''}
                                        onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık Rengi</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            className="h-10 w-10 border rounded cursor-pointer"
                                            value={settings.heroTitleColor || '#ffffff'}
                                            onChange={(e) => setSettings({ ...settings, heroTitleColor: e.target.value })}
                                        />
                                        <span className="text-sm text-gray-600">{settings.heroTitleColor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tour Warnings */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Tur Önemli Bilgiler & Uyarılar</h2>
                    <div className="space-y-4">
                        <RichTextEditor
                            label="Tüm Turlarda Gözükecek Önemli Bilgiler"
                            value={settings.tourImportantNotes || ''}
                            onChange={(val) => setSettings({ ...settings, tourImportantNotes: val })}
                        />
                    </div>
                </section>

                {/* Dynamic Footer Logos */}
                <section>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b">
                        <h2 className="text-xl font-semibold">Footer Logoları</h2>
                        <button
                            type="button"
                            onClick={addFooterLogo}
                            className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100 text-sm font-medium"
                        >
                            <Plus size={16} /> Logo Ekle
                        </button>
                    </div>

                    <div className="space-y-4">
                        {settings.footerLogos.length === 0 && (
                            <div className="text-center py-4 bg-gray-50 border border-dashed rounded text-gray-500 text-sm">
                                Henüz logo eklenmemiş.
                            </div>
                        )}
                        {settings.footerLogos.map((logo, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border relative items-start">
                                <button
                                    type="button"
                                    onClick={() => removeFooterLogo(index)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="w-full sm:w-32 shrink-0">
                                    <ImageUpload
                                        value={logo.imageUrl}
                                        onChange={(url) => updateFooterLogo(index, 'imageUrl', url)}
                                        label="Görsel"
                                        compact={true}
                                    />
                                </div>
                                <div className="flex-1 space-y-3 w-full">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Link URL</label>
                                        <div className="flex items-center gap-2">
                                            <LinkIcon size={14} className="text-gray-400" />
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded text-sm bg-white"
                                                placeholder="https://..."
                                                value={logo.link}
                                                onChange={(e) => updateFooterLogo(index, 'link', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Alt Metin (İsim)</label>
                                        <div className="flex items-center gap-2">
                                            <ImageIcon size={14} className="text-gray-400" />
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded text-sm bg-white"
                                                placeholder="Örn: TURSAB"
                                                value={logo.alt}
                                                onChange={(e) => updateFooterLogo(index, 'alt', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Information */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">İletişim Bilgileri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Firma Adı</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                placeholder="Royal Turizm"
                                value={settings.firmName || ''}
                                onChange={(e) => setSettings({ ...settings, firmName: e.target.value })}
                            />
                        </div>

                        {/* Dynamic Phones */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Telefon Numaraları</label>
                                <button
                                    type="button"
                                    onClick={addPhone}
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <Plus size={12} /> Ekle
                                </button>
                            </div>
                            <div className="space-y-2">
                                {settings.phones.length === 0 && (
                                    <div className="text-xs text-gray-400 italic">Numara eklenmemiş.</div>
                                )}
                                {settings.phones.map((phone, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            className="w-1/3 border rounded p-2 text-sm"
                                            placeholder="Etiket (Merkez)"
                                            value={phone.label}
                                            onChange={(e) => updatePhone(index, 'label', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="flex-1 border rounded p-2 text-sm"
                                            placeholder="+90 555..."
                                            value={phone.number}
                                            onChange={(e) => updatePhone(index, 'number', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhone(index)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                            <input
                                type="email"
                                className="w-full border rounded-lg p-2"
                                placeholder="info@royalturizm.com"
                                value={settings.email || ''}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                            <textarea
                                className="w-full border rounded-lg p-2 h-24"
                                placeholder="Açık adres..."
                                value={settings.address || ''}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL (İframe src)</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                placeholder="https://www.google.com/maps/embed?pb=..."
                                value={settings.mapEmbedUrl || ''}
                                onChange={(e) => setSettings({ ...settings, mapEmbedUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </section>

                {/* Social Media */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Sosyal Medya Linkleri</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['instagram', 'facebook', 'whatsapp', 'youtube'].map((s) => (
                            <div key={s}>
                                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{s}</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    placeholder={`https://${s}.com/...`}
                                    value={(settings.socialLinks as any)?.[s] || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socialLinks: { ...settings.socialLinks, [s]: e.target.value }
                                    })}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Email / SMTP Settings */}
                <section className="bg-blue-50/30 p-6 rounded-xl border border-blue-100">
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-blue-200 text-blue-900">E-posta (SMTP) Bildirim Ayarları</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                placeholder="Örn: smtp.yandex.com.tr"
                                value={emailSettings.host}
                                onChange={(e) => setEmailSettings({ ...emailSettings, host: e.target.value })}
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Başına http:// koymayın. Sadece alan adı.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                            <input
                                type="number"
                                className="w-full border rounded-lg p-2"
                                placeholder="465 veya 587"
                                value={emailSettings.port}
                                onChange={(e) => setEmailSettings({ ...emailSettings, port: parseInt(e.target.value) })}
                            />
                            <p className="text-[10px] text-gray-500 mt-1">SSL için 465, TLS için 587 önerilir.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı (Email)</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                value={emailSettings.user}
                                onChange={(e) => setEmailSettings({ ...emailSettings, user: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                            <input
                                type="password"
                                className="w-full border rounded-lg p-2"
                                value={emailSettings.pass}
                                onChange={(e) => setEmailSettings({ ...emailSettings, pass: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gönderen E-posta (From)</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                placeholder="info@alanadi.com"
                                value={emailSettings.fromEmail}
                                onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bildirim Alacak E-postalar (Yönetici)</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                placeholder="yonetim@site.com, destek@site.com"
                                value={emailSettings.notificationEmail}
                                onChange={(e) => setEmailSettings({ ...emailSettings, notificationEmail: e.target.value })}
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Birden fazla mail için virgül (,) koyarak ekleyin.</p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={handleTestEmail}
                            disabled={testingMail}
                            className={`w-full md:w-auto px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
                                testingMail ? 'bg-gray-100 text-gray-400' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                            }`}
                        >
                            {testingMail ? 'Bağlantı Test Ediliyor...' : 'SMTP Bağlantısını Test Et'}
                        </button>

                        {testResult && (
                            <div className={`p-3 rounded-lg text-xs font-medium border ${
                                testResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                                {testResult.message}
                            </div>
                        )}
                    </div>
                </section>

                {/* Legal Texts */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Hukuki Metinler (Sözleşmeler)</h2>
                    <div className="space-y-6">
                        {[
                            { id: 'kvkkText', label: 'KVKK Aydınlatma Metni' },
                            { id: 'privacyPolicyText', label: 'Gizlilik Politikası' },
                            { id: 'distanceSalesText', label: 'Mesafeli Satış Sözleşmesi' },
                            { id: 'cancellationText', label: 'İptal ve İade Koşulları' }
                        ].map((field) => (
                            <RichTextEditor
                                key={field.id}
                                label={field.label}
                                value={(settings as any)[field.id] || ''}
                                onChange={(val) => setSettings({ ...settings, [field.id]: val })}
                            />
                        ))}
                    </div>
                </section>

                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t p-4 flex justify-end z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold shadow-lg transition-transform hover:-translate-y-1"
                    >
                        {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
