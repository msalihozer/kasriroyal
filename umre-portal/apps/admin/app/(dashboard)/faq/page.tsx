"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Plus } from 'lucide-react';

export default function FaqPage() {
    const router = useRouter();
    const [faq, setFaq] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFaq();
    }, []);

    const fetchFaq = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/faq`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFaq(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/faq/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (!confirm('Silmek istediğinizden emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/faq/${item.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchFaq();
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const columns = [
        { key: 'question', label: 'Soru', sortable: true },
        { key: 'category', label: 'Kategori', sortable: true },
        { key: 'orderIndex', label: 'Sıra', sortable: true },
        {
            key: 'isActive',
            label: 'Durum',
            render: (value: boolean) => (
                <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {value ? 'Aktif' : 'Pasif'}
                </span>
            )
        },
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Sıkça Sorulan Sorular</h1>
                <button
                    onClick={() => router.push('/faq/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Soru
                </button>
            </div>

            <DataTable
                columns={columns}
                data={faq}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Soru ara..."
            />
        </div>
    );
}
