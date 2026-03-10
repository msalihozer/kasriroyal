"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../../../components/ui/ImageUpload';

export default function TestimonialFormPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        fullName: '',
        rating: 5,
        comment: '',
        avatarUrl: '',
        isFeatured: false,
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetchTestimonial();
        }
    }, []);

    const fetchTestimonial = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/api/testimonials/${params.id}`, {
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
                ? 'http://localhost:4000/api/testimonials'
                : `http://localhost:4000/api/testimonials/${params.id}`;

            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/testimonials');
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
            <h1 className="text-3xl font-bold mb-6">{isNew ? 'Yeni Yorum' : 'Yorum Düzenle'}</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İsim Soyisim</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Puan</label>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map(star => (
                            <label key={star} className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="rating"
                                    value={star}
                                    checked={formData.rating === star}
                                    onChange={() => setFormData({ ...formData, rating: star })}
                                />
                                <span>{star} Yıldız</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yorum</label>
                    <textarea
                        className="w-full border rounded-lg p-2"
                        rows={4}
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <ImageUpload
                        value={formData.avatarUrl}
                        onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                        label="Avatar (Opsiyonel)"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        />
                        <span className="text-sm font-medium text-gray-700">Öne Çıkan (Anasayfada göster)</span>
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
                        onClick={() => router.push('/testimonials')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}
