"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../../../components/ui/ImageUpload';

export default function AirlineFormPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        logoUrl: '',
        websiteUrl: '',
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetchAirline();
        }
    }, []);

    const fetchAirline = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/airlines/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFormData(data);
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
            const url = isNew
                ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/airlines`
                : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/airlines/${params.id}`;

            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/airlines');
            } else {
                alert('Kaydetme başarısız');
            }
        } catch (err) {
            alert('Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">{isNew ? 'Yeni Havayolu' : 'Havayolu Düzenle'}</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Örn: Türk Hava Yolları"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kısaltma / Kod</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="Örn: TK"
                    />
                </div>

                <div>
                    <ImageUpload
                        value={formData.logoUrl}
                        onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                        label="Havayolu Logosu"
                        disabledCrop={true}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Web Sitesi</label>
                    <input
                        type="url"
                        className="w-full border rounded-lg p-2"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        placeholder="https://www.turkishairlines.com"
                    />
                </div>

                <div className="flex gap-4 pt-4 border-t">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/airlines')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}
