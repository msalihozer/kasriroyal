"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../../../components/ui/ImageUpload';
import RichTextEditor from '../../../../components/ui/RichTextEditor';

export default function VehicleFormPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        modelName: '',
        capacity: 4,
        description: '',
        imageUrl: '',
        features: [] as string[],
        isFeatured: false,
        status: 'draft',
    });

    const [featuresInput, setFeaturesInput] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetchVehicle();
        }
    }, []);

    const fetchVehicle = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/vehicles/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFormData(data);
                if (data.features && Array.isArray(data.features)) {
                    setFeaturesInput(data.features.join('\n'));
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const featuresArray = featuresInput.split('\n').filter(f => f.trim() !== '');

        try {
            const token = localStorage.getItem('token');
            const url = isNew
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/vehicles`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/vehicles/${params.id}`;

            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    features: featuresArray
                })
            });

            if (res.ok) {
                router.push('/vehicles');
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
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">{isNew ? 'Yeni Araç' : 'Araç Düzenle'}</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Model Adı</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-2"
                            value={formData.modelName}
                            onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kapasite (Kişi)</label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-2"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div>
                    <ImageUpload
                        value={formData.imageUrl}
                        onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                        label="Araç Görseli"
                    />
                </div>

                <RichTextEditor
                    value={formData.description}
                    onChange={(html) => setFormData({ ...formData, description: html })}
                    label="Açıklama"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Özellikler (Her satıra bir özellik)</label>
                    <textarea
                        className="w-full border rounded-lg p-2"
                        rows={5}
                        placeholder="Örn:\nKlimalı\nWifi\nDeri Koltuk"
                        value={featuresInput}
                        onChange={(e) => setFeaturesInput(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        />
                        <span className="text-sm font-medium text-gray-700">Öne Çıkan</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="status"
                            value="draft"
                            checked={formData.status === 'draft'}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        />
                        <span className="text-sm font-medium text-gray-700">Taslak</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="status"
                            value="published"
                            checked={formData.status === 'published'}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        />
                        <span className="text-sm font-medium text-gray-700">Yayında</span>
                    </label>
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
                        onClick={() => router.push('/vehicles')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}
