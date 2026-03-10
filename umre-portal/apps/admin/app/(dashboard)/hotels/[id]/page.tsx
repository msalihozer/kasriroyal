"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '../../../../components/ui/RichTextEditor';
import GalleryUpload from '../../../../components/ui/GalleryUpload';
import ImageUpload from '../../../../components/ui/ImageUpload';
import { Plus, X } from 'lucide-react';

export default function HotelFormPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        imageUrl: '',
        locationId: '',
        stars: 5,
        shortDescription: '',
        description: '',
        locationText: '',
        websiteUrl: '',
        lat: '',
        lng: '',
        features: [] as string[], // array of IDs
        gallery: [] as string[],
        isFeatured: false,
        status: 'draft',
    });

    const [locations, setLocations] = useState<any[]>([]);
    const [availableFeatures, setAvailableFeatures] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchLocations();
        fetchFeatures();
        if (!isNew) {
            fetchHotel();
        }
    }, []);

    const fetchLocations = async () => {
        const res = await fetch('http://localhost:4000/api/locations');
        if (res.ok) setLocations(await res.json());
    };

    const fetchFeatures = async () => {
        const res = await fetch('http://localhost:4000/api/features');
        if (res.ok) setAvailableFeatures(await res.json());
    };

    const fetchHotel = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/api/hotels/by-id/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();

                // Map API response to form data
                setFormData({
                    ...data,
                    imageUrl: data.imageUrl || '',
                    locationId: data.locationId || '',
                    features: data.features ? data.features.map((f: any) => f.id) : [], // Extract IDs from objects
                    gallery: data.gallery || [],
                    locationText: data.locationText || '',
                    websiteUrl: data.websiteUrl || '',
                    lat: data.lat || '',
                    lng: data.lng || '',
                    shortDescription: data.shortDescription || ''
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleFeature = (featureId: string) => {
        setFormData(prev => {
            const exists = prev.features.includes(featureId);
            if (exists) {
                return { ...prev, features: prev.features.filter(id => id !== featureId) };
            } else {
                return { ...prev, features: [...prev.features, featureId] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const url = isNew
                ? 'http://localhost:4000/api/hotels'
                : `http://localhost:4000/api/hotels/${params.id}`;

            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/hotels');
            } else {
                alert('Kaydetme başarısız');
            }
        } catch (err) {
            alert('Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const groupedFeatures = availableFeatures.reduce((acc: any, feature: any) => {
        const cat = feature.category || 'Diğer Özellikler';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(feature);
        return acc;
    }, {});

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">{isNew ? 'Yeni Otel' : 'Otel Düzenle'}</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Otel Adı</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-2"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-2"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {/* Primary Image Upload */}
                <div>
                    <ImageUpload
                        value={formData.imageUrl}
                        onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                        label="Otel Kapak Görseli (Thumbnail)"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şehir / Lokasyon</label>
                        <select
                            className="w-full border rounded-lg p-2"
                            value={formData.locationId}
                            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                            required
                        >
                            <option value="">Seçiniz</option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yıldız</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            className="w-full border rounded-lg p-2"
                            value={formData.stars}
                            onChange={(e) => setFormData({ ...formData, stars: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                {/* Short Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama (Listede görünür)</label>
                    <textarea
                        className="w-full border rounded-lg p-2"
                        rows={2}
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    />
                </div>

                {/* Location Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konum Açıklaması (Örn: Haram'a 500m)</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-2"
                            value={formData.locationText}
                            onChange={(e) => setFormData({ ...formData, locationText: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enlem (Lat)</label>
                        <input
                            type="number"
                            step="any"
                            className="w-full border rounded-lg p-2"
                            value={formData.lat}
                            onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Boylam (Lng)</label>
                        <input
                            type="number"
                            step="any"
                            className="w-full border rounded-lg p-2"
                            value={formData.lng}
                            onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Web Sitesi URL</label>
                    <input
                        type="url"
                        className="w-full border rounded-lg p-2"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        placeholder="https://..."
                    />
                </div>

                {/* Gallery */}
                <div>
                    <GalleryUpload
                        value={formData.gallery}
                        onChange={(urls) => setFormData({ ...formData, gallery: urls })}
                        label="Otel Görselleri (Galeri)"
                    />
                </div>

                {/* Features Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Otelin İmkanları</label>
                    <div className="space-y-6">
                        {Object.entries(groupedFeatures).map(([category, features]: any) => (
                            <div key={category} className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">{category}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {features.map((feature: any) => (
                                        <label key={feature.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded bg-white">
                                            <input
                                                type="checkbox"
                                                checked={formData.features.includes(feature.id)}
                                                onChange={() => toggleFeature(feature.id)}
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                            <span className="text-sm font-medium">{feature.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <RichTextEditor
                    value={formData.description}
                    onChange={(html) => setFormData({ ...formData, description: html })}
                    label="Detaylı Açıklama"
                />

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
                        onClick={() => router.push('/hotels')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}
