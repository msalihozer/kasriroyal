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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/pages`, {
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
            render: (value: string) => (
                <span className={`px-2 py-1 rounded text-xs ${value === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {value === 'published' ? 'Yayında' : 'Taslak'}
                </span>
            )
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
