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
        publishedAt: null as string | null,
    });

    const [isScheduled, setIsScheduled] = useState(false);
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/pages/${params.id}?status=all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const text = await res.text();
                if (!text) return;
                const data = JSON.parse(text);

                if (data.id) {
                    setPageId(data.id);
                }

                // Handle legacy or different block structures
                let blocks = data.blocks;

                if (!Array.isArray(blocks)) {
                    if (data.slug === 'home' && (!blocks || blocks.length === 0)) {
                        blocks = [
                            { type: 'heroVideo', data: { title: 'Manevi Yolculuğunuz Başlıyor', videoUrl: '' } },
                            { type: 'featuredTours', data: { title: 'Öne Çıkan Turlar' } }
                        ];
                    } else {
                        blocks = [];
                    }
                }

                const publishedAtDate = data.publishedAt ? new Date(data.publishedAt) : null;
                const isFuture = publishedAtDate ? publishedAtDate > new Date() : false;

                setFormData({
                    title: data.title || '',
                    slug: data.slug || '',
                    category: data.category || 'general',
                    summary: data.summary || '',
                    content: data.content || '',
                    imageUrl: data.imageUrl || '',
                    status: data.status || 'draft',
                    blocks,
                    publishedAt: publishedAtDate ? publishedAtDate.toISOString().slice(0, 16) : null
                });
                setIsScheduled(isFuture);
            } else if (res.status === 404 && params.id !== 'new') {
                let category = searchParams?.category || 'general';
                if (params.id.includes('umre')) category = 'vip-umre';
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
            const url = pageId
                ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/pages/${pageId}`
                : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/pages`;

            const method = pageId ? 'PATCH' : 'POST';

            // Prepare payload
            const payload = { ...formData };
            
            // Logic for publishedAt
            if (!isScheduled) {
                if (payload.status === 'published') {
                    payload.publishedAt = new Date().toISOString();
                } else {
                    payload.publishedAt = null;
                }
            } else {
                if (payload.publishedAt) {
                    payload.publishedAt = new Date(payload.publishedAt).toISOString();
                }
                payload.status = 'published';
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
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
        <div className="max-w-4xl pb-20">
            <h1 className="text-3xl font-bold mb-6">{isNew ? 'Yeni Sayfa' : 'Sayfa Düzenle'}</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık</label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL)</label>
                        <input
                            type="text"
                            className={`w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none ${formData.slug === 'vip-umre-landing' ? 'bg-gray-100 text-gray-500' : ''}`}
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            disabled={formData.slug === 'vip-umre-landing'}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori (Sayfa Türü)</label>
                    <select
                        className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-white transition-all outline-none"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="general">Genel Sayfa</option>
                        <option value="vip-umre">VIP Umre Sayfası</option>
                    </select>
                </div>

                {formData.slug === 'vip-umre-landing' && (
                    <div className="space-y-4 border-b pb-6">
                        <h2 className="text-xl font-bold text-gray-800">Giriş Ekranı Tasarımı</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Yazı Rengi</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    className="h-12 w-24 p-1 border rounded-xl cursor-pointer"
                                    value={formData.blocks?.find((b: any) => b.type === 'headerSettings')?.data?.color || '#ffffff'}
                                    onChange={(e) => {
                                        const color = e.target.value;
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
                                <span className="text-xs text-gray-500">Ana sayfadaki video üzeri yazı rengi.</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6 border-b pb-8">
                    <h2 className="text-xl font-bold text-gray-800">İçerik Ayarları</h2>
                    
                    <div>
                        <ImageUpload
                            label="Kapak Görseli"
                            value={formData.imageUrl}
                            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Özet (Kart Açıklaması)</label>
                        <textarea
                            className="w-full border border-gray-200 rounded-xl p-3 h-24 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
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

                {formData.slug !== 'vip-umre-landing' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 text-blue-600">Sayfa Blokları</h2>
                        {formData.blocks && formData.blocks.filter((b: any) => b.type !== 'headerSettings').map((block: any, index: number) => (
                            <div key={index} className="border-2 border-gray-50 rounded-2xl p-6 bg-gray-50/50 hover:bg-white hover:border-blue-100 transition-all shadow-sm">
                                <h3 className="font-bold mb-4 text-blue-600 uppercase text-xs tracking-widest">{block.type}</h3>

                                {block.type === 'heroVideo' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Video Üzeri Başlık</label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                                                value={block.data?.title || ''}
                                                onChange={(e) => updateBlock(index, { ...block.data, title: e.target.value })}
                                            />
                                        </div>
                                        <VideoUpload
                                            label="Arkaplan Videosu"
                                            value={block.data?.videoUrl}
                                            onChange={(url) => updateBlock(index, { ...block.data, videoUrl: url })}
                                        />
                                    </div>
                                )}

                                {block.type === 'featuredTours' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Bölüm Başlığı</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                                            value={block.data?.title || ''}
                                            onChange={(e) => updateBlock(index, { ...block.data, title: e.target.value })}
                                        />
                                    </div>
                                )}

                                {!['heroVideo', 'featuredTours'].includes(block.type) && (
                                    <div className="text-sm text-gray-400 italic">Bu blok türü otomatik yönetilmektedir.</div>
                                )}
                            </div>
                        ))}

                        {(!formData.blocks || formData.blocks.length === 0) && (
                            <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 bg-gray-50">
                                <p className="font-medium">Henüz interaktif blok eklenmemiş.</p>
                            </div>
                        )}
                    </div>
                )}

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
                                {formData.status === 'published' && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase font-bold">Aktif</span>}
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
                                {formData.status === 'draft' && <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase font-bold">Taslak</span>}
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">Planlı Paylaşım</label>
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
                                    className="w-full border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-white outline-none shadow-sm"
                                    value={formData.publishedAt || ''}
                                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                    required={isScheduled}
                                />
                                <p className="text-[11px] text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-100 leading-relaxed">
                                    Bu sayfa belirlediğiniz tarihte otomatik olarak "Yayına" alınacaktır.
                                </p>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400 italic py-4">
                                Zamanlama kapalı. {formData.status === 'published' ? 'Anında yayına girecek.' : 'Sadece taslak olarak tutulacak.'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4 pt-10 border-t">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-12 py-4 rounded-2xl hover:bg-blue-700 disabled:opacity-50 font-bold transition-all shadow-xl shadow-blue-100"
                    >
                        {saving ? 'Kaydediliyor...' : 'Sayfayı Kaydet'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push(formData.category === 'vip-umre' ? '/vip-umre-pages' : '/pages')}
                        className="bg-white text-gray-500 px-8 py-4 rounded-2xl border border-gray-200 hover:bg-gray-50 font-semibold transition-all"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}
