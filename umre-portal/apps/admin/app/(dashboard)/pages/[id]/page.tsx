"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '../../../../components/ui/RichTextEditor';
import ImageUpload from '../../../../components/ui/ImageUpload';
import VideoUpload from '../../../../components/ui/VideoUpload';

export default function PageFormPage({ params, searchParams }: { params: { id: string }, searchParams: { category?: string } }) {
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: searchParams?.category || 'general',
        summary: '',
        content: '',
        imageUrl: '',
        blocks: [] as any[], // Changed to array to match schema
        status: 'published',
    });

    const [pageId, setPageId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetchPage();
        } else if (searchParams?.category) {
            // Ensure category is set if creating new page with param
            setFormData(prev => ({ ...prev, category: searchParams.category || 'general' }));
        }
    }, [searchParams]);

    const fetchPage = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/pages/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();

                if (data.id) {
                    setPageId(data.id);
                }

                // Handle legacy or different block structures
                let blocks = data.blocks;

                // If blocks is null/empty, or just simple json, try to parse or default
                if (!Array.isArray(blocks)) {
                    // If it has content property, it might be the old format we assumed
                    // For our new logic, we want a list of blocks.
                    // But if the page is 'home', it should start with specific default blocks if empty
                    if (data.slug === 'home' && (!blocks || blocks.length === 0)) {
                        blocks = [
                            { type: 'heroVideo', data: { title: 'Manevi Yolculuğunuz Başlıyor', videoUrl: '' } },
                            { type: 'featuredTours', data: { title: 'Öne Çıkan Turlar' } }
                        ];
                    } else {
                        blocks = [];
                    }
                }

                setFormData({
                    title: data.title || '',
                    slug: data.slug || '',
                    category: data.category || 'general',
                    summary: data.summary || '',
                    content: data.content || '',
                    imageUrl: data.imageUrl || '',
                    status: data.status || 'draft',
                    blocks
                });
            } else if (res.status === 404 && params.id !== 'new') {
                // Determine category based on known slugs or searchParams
                let category = searchParams?.category || 'general';
                if (params.id.includes('umre')) category = 'vip-umre';

                // If page not found but we have a slug via URL, treat as creating that page
                setFormData(prev => ({ ...prev, slug: params.id, category }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateBlock = (index: number, newData: any) => {
        const newBlocks = [...formData.blocks];
        newBlocks[index] = { ...newBlocks[index], data: newData };
        setFormData({ ...formData, blocks: newBlocks });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');

            // If we have a pageId, use it for updates. Otherwise, create new.
            const url = pageId
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/pages/${pageId}`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/pages`;

            const method = pageId ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                // If we were creating, redirect to list or stay
                // For simplified UX, let's go back to proper list based on category
                if (formData.category === 'vip-umre') {
                    router.push('/vip-umre-pages');
                } else {
                    router.push('/pages');
                }
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
            <h1 className="text-3xl font-bold mb-6">{isNew ? 'Yeni Sayfa' : 'Sayfa Düzenle'}</h1>

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
                            className={`w-full border rounded-lg p-2 ${formData.slug === 'vip-umre-landing' ? 'bg-gray-100 text-gray-500' : ''}`}
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            disabled={formData.slug === 'vip-umre-landing'}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori (Sayfa Türü)</label>
                    <select
                        className="w-full border rounded-lg p-2"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="general">Genel Sayfa</option>
                        <option value="vip-umre">VIP Umre Sayfası</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Eğer bu sayfa "VIP Umre" bölümünde gösterilecekse seçiniz.</p>
                </div>

                {formData.slug === 'vip-umre-landing' && (
                    <div className="space-y-4 border-b pb-6">
                        <h2 className="text-xl font-semibold">Giriş Ekranı Ayarları</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yazı Rengi</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    className="h-10 w-20 p-1 border rounded cursor-pointer"
                                    value={formData.blocks?.find((b: any) => b.type === 'headerSettings')?.data?.color || '#ffffff'}
                                    onChange={(e) => {
                                        const color = e.target.value;
                                        // Update or add headerSettings block
                                        const existingBlockIndex = formData.blocks.findIndex((b: any) => b.type === 'headerSettings');
                                        const newBlocks = [...(formData.blocks || [])];

                                        if (existingBlockIndex >= 0) {
                                            newBlocks[existingBlockIndex] = { type: 'headerSettings', data: { color } };
                                        } else {
                                            newBlocks.push({ type: 'headerSettings', data: { color } });
                                        }
                                        setFormData({ ...formData, blocks: newBlocks });
                                    }}
                                />
                                <span className="text-sm text-gray-500">Başlık ve açıklama yazısının rengini buradan seçebilirsiniz.</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Fields (VIP Pages) */}
                <div className="space-y-4 border-b pb-6">
                    <h2 className="text-xl font-semibold">İçerik Detayları</h2>
                    <p className="text-sm text-gray-500">Bu alanlar standart içerik sayfaları (VIP Umre vb.) için kullanılır.</p>

                    <div>
                        <ImageUpload
                            label="Kapak Görseli"
                            value={formData.imageUrl}
                            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Özet (Kart Açıklaması)</label>
                        <textarea
                            className="w-full border rounded-lg p-2 h-24"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            placeholder="Kart görünümünde çıkacak kısa açıklama..."
                        />
                    </div>

                    {formData.slug !== 'vip-umre-landing' && (
                        <div>
                            <RichTextEditor
                                label="Sayfa İçeriği"
                                value={formData.content}
                                onChange={(html) => setFormData({ ...formData, content: html })}
                            />
                        </div>
                    )}
                </div>

                {/* Blocks Editor - Hide for landing page to keep it simple as requested */}
                {formData.slug !== 'vip-umre-landing' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-2">Sayfa Blokları</h2>
                        {formData.blocks && formData.blocks.filter((b: any) => b.type !== 'headerSettings').map((block: any, index: number) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="font-medium mb-3 text-blue-600 uppercase text-sm tracking-wide">{block.type}</h3>

                                {block.type === 'heroVideo' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Video Üzeri Başlık</label>
                                            <input
                                                type="text"
                                                className="w-full border rounded-lg p-2"
                                                value={block.data?.title || ''}
                                                onChange={(e) => updateBlock(index, { ...block.data, title: e.target.value })}
                                            />
                                        </div>
                                        <VideoUpload
                                            label="Arkaplan Videosu"
                                            value={block.data?.videoUrl}
                                            onChange={(url) => updateBlock(index, { ...block.data, videoUrl: url })}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Dosya boyutu max 50MB. MP4 formatı önerilir.</p>
                                    </div>
                                )}

                                {block.type === 'featuredTours' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bölüm Başlığı</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded-lg p-2"
                                            value={block.data?.title || ''}
                                            onChange={(e) => updateBlock(index, { ...block.data, title: e.target.value })}
                                        />
                                    </div>
                                )}

                                {/* Fallback for unknown blocks */}
                                {!['heroVideo', 'featuredTours'].includes(block.type) && (
                                    <div className="text-sm text-gray-500 italic">Bu blok türü için yönetici paneli düzenleyicisi bulunmuyor.</div>
                                )}
                            </div>
                        ))}

                        {(!formData.blocks || formData.blocks.length === 0) && (
                            <div className="p-8 text-center border-2 border-dashed rounded-lg text-gray-400">
                                Henüz blok eklenmemiş.
                            </div>
                        )}
                    </div>
                )}

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
                        onClick={() => router.push('/pages')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}
