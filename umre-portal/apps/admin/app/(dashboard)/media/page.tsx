"use client";
import { useEffect, useState } from 'react';
import { Trash2, Upload, Copy } from 'lucide-react';
import ImageUpload from '../../../components/ui/ImageUpload';

export default function MediaPage() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetchMedia();
    }, [refreshKey]);

    const fetchMedia = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/media`);
            if (res.ok) {
                const data = await res.json();
                setMedia(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/media/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setRefreshKey(prev => prev + 1);
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const handleUploadComplete = () => {
        setRefreshKey(prev => prev + 1);
    };

    const copyToClipboard = (url: string) => {
        const fullUrl = `http://localhost:4000${url}`;
        navigator.clipboard.writeText(fullUrl);
        alert('URL Kopyalandı: ' + fullUrl);
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Medya Kütüphanesi</h1>
                {/* We can use ImageUpload component but usually we want a simpler button for library additions. 
                    However, reusing ImageUpload is fine for now as it handles the logic. 
                    Or we can create a hidden upload input trigger. 
                    Let's just use a simple upload area.
                */}
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Yeni Dosya Yükle</h2>
                <div className="max-w-xs">
                    <ImageUpload
                        onChange={handleUploadComplete}
                        label=""
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {media.map((item: any) => (
                    <div key={item.id} className="group relative bg-white rounded-lg shadow overflow-hidden border hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                            {item.type === 'image' ? (
                                <img src={`http://localhost:4000${item.url}`} alt={item.altText} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 font-medium uppercase tracking-wider">{item.type}</span>
                            )}
                        </div>
                        <div className="p-2 bg-white">
                            <p className="text-xs text-gray-500 truncate" title={item.altText}>{item.altText}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => copyToClipboard(item.url)}
                                className="bg-white p-1.5 rounded shadow text-gray-600 hover:text-blue-600"
                                title="URL Kopyala"
                            >
                                <Copy size={14} />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-white p-1.5 rounded shadow text-gray-600 hover:text-red-600"
                                title="Sil"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {media.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Henüz dosya yüklenmemiş.
                </div>
            )}
        </div>
    );
}
