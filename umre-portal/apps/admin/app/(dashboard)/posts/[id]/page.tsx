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
        // categoryId: '', // To be implemented when categories are available
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetchPost();
        }
    }, []);

    const fetchPost = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts/${params.id}`, {
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
                ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts`
                : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts/${params.id}`;

            // Sanitize data before sending
            const { id, createdAt, updatedAt, category, ...payload } = formData as any;

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
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">{isNew ? 'Yeni Yazı' : 'Yazı Düzenle'}</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
                    <textarea
                        className="w-full border rounded-lg p-2"
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                </div>

                <div>
                    <ImageUpload
                        value={formData.coverImageUrl}
                        onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
                        label="Kapak Görseli (Thumbnail)"
                    />
                </div>

                <RichTextEditor
                    value={formData.content}
                    onChange={(html) => setFormData({ ...formData, content: html })}
                    label="İçerik"
                />

                <div className="flex items-center gap-4">
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
                        onClick={() => router.push('/posts')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}
