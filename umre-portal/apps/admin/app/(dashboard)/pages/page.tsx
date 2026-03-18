"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Plus } from 'lucide-react';

export default function PagesPage() {
    const router = useRouter();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/pages?status=all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPages(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (page: any) => {
        router.push(`/pages/${page.id}`);
    };

    const handleDelete = async (page: any) => {
        if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/pages/${page.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchPages();
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const columns = [
        { key: 'title', label: 'Başlık', sortable: true },
        { key: 'slug', label: 'Slug', sortable: true },
        {
            key: 'status',
            label: 'Durum',
            render: (value: string, item: any) => {
                const isPublished = value === 'published';
                const isScheduled = isPublished && item.publishedAt && new Date(item.publishedAt) > new Date();
                
                if (isScheduled) {
                    return (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase">
                            Zamanlandı
                        </span>
                    );
                }
                
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        isPublished 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                        {isPublished ? 'Yayında' : 'Taslak'}
                    </span>
                );
            }
        },
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Sayfalar</h1>
                <button
                    onClick={() => router.push('/pages/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Sayfa
                </button>
            </div>

            <DataTable
                columns={columns}
                data={pages}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Sayfa ara..."
            />
        </div>
    );
}
