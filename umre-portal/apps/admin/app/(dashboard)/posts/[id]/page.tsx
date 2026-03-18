"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../../../components/ui/ImageUpload';
import RichTextEditor from '../../../../components/ui/RichTextEditor';

export default function PostFormPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImageUrl: '',
        status: 'draft',
        publishedAt: null as string | null,
        // categoryId: '', // To be implemented when categories are available
    });

    const [isScheduled, setIsScheduled] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetchPost();
        }
    }, []);

    const fetchPost = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts/${params.id}?status=all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const text = await res.text();
                if (!text) return;
                const data = JSON.parse(text);
                
                const publishedAtDate = data.publishedAt ? new Date(data.publishedAt) : null;
                const isFuture = publishedAtDate ? publishedAtDate > new Date() : false;

                setFormData({
                    ...data,
                    publishedAt: publishedAtDate ? publishedAtDate.toISOString().slice(0, 16) : null
                });
                setIsScheduled(isFuture);
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
                ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts`
                : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts/${params.id}`;

            // Sanitize data before sending
            const { id, createdAt, updatedAt, category, ...payload } = formData as any;

            // Logic for publishedAt
            if (!isScheduled) {
                // If not scheduled, but status is published, set to now
                if (payload.status === 'published') {
                    payload.publishedAt = new Date().toISOString();
                } else {
                    payload.publishedAt = null;
                }
            } else {
                // If scheduled, ensure it's in ISO format
                if (payload.publishedAt) {
                    payload.publishedAt = new Date(payload.publishedAt).toISOString();
                }
                // When scheduled, we treat it as 'published' status but with future date
                // so the API hides it until the date arrives.
                payload.status = 'published';
            }

            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/posts');
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
        <div className="max-w-4xl pb-20">
            <h1 className="text-3xl font-bold mb-6">{isNew ? 'Yeni Yazı' : 'Yazı Düzenle'}</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık</label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={formData.title}
                            placeholder="Yazı başlığı..."
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL)</label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50"
                            value={formData.slug}
                            placeholder="yazi-basligi-buraya"
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Özet (Meta Açıklama)</label>
                    <textarea
                        className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        rows={3}
                        value={formData.excerpt}
                        placeholder="Arama sonuçlarında görünecek kısa açıklama..."
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                </div>

                <div>
                    <ImageUpload
                        value={formData.coverImageUrl}
                        onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
                        label="Kapak Görseli"
                    />
                </div>

                <div className="border-t pt-8">
                    <RichTextEditor
                        value={formData.content}
                        onChange={(html) => setFormData({ ...formData, content: html })}
                        label="Yazı İçeriği"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Yayın Durumu</label>
                        <div className="flex flex-col gap-3">
                            <label className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.status === 'published' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="published"
                                        className="w-4 h-4 text-blue-600"
                                        checked={formData.status === 'published'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    />
                                    <span className="font-semibold text-sm">Hemen Yayınla</span>
                                </div>
                                {formData.status === 'published' && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase">Aktif</span>}
                            </label>

                            <label className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.status === 'draft' ? 'bg-orange-50 border-orange-400 text-orange-700' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="draft"
                                        className="w-4 h-4 text-orange-600"
                                        checked={formData.status === 'draft'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    />
                                    <span className="font-semibold text-sm">Taslak Olarak Kaydet</span>
                                </div>
                                {formData.status === 'draft' && <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase">Taslak</span>}
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">Yayın Planla</label>
                                <button
                                    type="button"
                                    onClick={() => setIsScheduled(!isScheduled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isScheduled ? 'bg-blue-600' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isScheduled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            
                            {isScheduled ? (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <input
                                        type="datetime-local"
                                        className="w-full border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-white"
                                        value={formData.publishedAt || ''}
                                        onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                        required={isScheduled}
                                    />
                                    <p className="text-[11px] text-blue-600 bg-blue-50 p-2 rounded-lg">
                                        💡 Bu yazı seçtiğiniz tarihte <b>otomatik olarak</b> yayına alınacaktır.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-400 italic py-3">
                                    Zamanlama kapalı. {formData.status === 'published' ? 'Kayıt anında yayınlanacak.' : 'Taslak olarak saklanacak.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-8 border-t">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-10 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/posts')}
                        className="bg-white text-gray-600 px-8 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold transition-all"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}
